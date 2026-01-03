# 🎨 AI Avatar Generation Pipeline for Snake Photos

## Overview
Upload real snake photos → AI generates custom avatars → Display in game

**Status:** Design phase  
**Tech:** Cloudflare Workers AI (free tier)  
**Cost:** FREE (10k neurons/day = ~100 avatars/day)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS SNAKE PHOTO                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          FRONTEND (game.html)                                │
│  • File input (accept: image/*)                              │
│  • Preview thumbnail                                         │
│  • Upload button → POST /api/upload-snake-photo              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│     CLOUDFLARE WORKER (/api/upload-snake-photo)              │
│  1. Validate image (size, format)                            │
│  2. Save original to R2 bucket: snake-photos/                │
│  3. Call Workers AI for avatar generation                    │
│  4. Save avatar to R2 bucket: snake-avatars/                 │
│  5. Update KV: snake:{id}:photos                             │
│  6. Return avatar URLs                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               CLOUDFLARE WORKERS AI                          │
│  Model: @cf/stabilityai/stable-diffusion-xl-base-1.0        │
│                                                               │
│  Prompt Templates:                                           │
│  • "cute pixel art snake avatar, ${morph}, cartoon style"   │
│  • "adorable chibi snake, ${species}, kawaii, simple bg"    │
│  • "minimalist snake icon, ${color}, flat design"           │
│                                                               │
│  Output: 512x512 PNG                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDFLARE R2 STORAGE                     │
│                                                               │
│  Buckets:                                                    │
│  • serpent-town-photos/     (original uploads)               │
│  • serpent-town-avatars/    (AI-generated)                   │
│                                                               │
│  Path structure:                                             │
│  /{user_id}/{snake_id}/original.jpg                          │
│  /{user_id}/{snake_id}/avatar-64.png                         │
│  /{user_id}/{snake_id}/avatar-128.png                        │
│  /{user_id}/{snake_id}/avatar-512.png                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   CLOUDFLARE KV STORAGE                      │
│                                                               │
│  Key: snake:{snake_id}:photos                                │
│  Value: {                                                    │
│    original_url: "https://...",                              │
│    avatar_urls: {                                            │
│      small: "https://.../avatar-64.png",                     │
│      medium: "https://.../avatar-128.png",                   │
│      large: "https://.../avatar-512.png"                     │
│    },                                                        │
│    generated_at: "2026-01-03T03:00:00Z",                     │
│    ai_model: "stable-diffusion-xl"                           │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Implementation Steps

### Phase 1: R2 Bucket Setup
```bash
# Create R2 buckets
wrangler r2 bucket create serpent-town-photos
wrangler r2 bucket create serpent-town-avatars

# Update wrangler.toml
[[r2_buckets]]
binding = "PHOTOS"
bucket_name = "serpent-town-photos"

[[r2_buckets]]
binding = "AVATARS"
bucket_name = "serpent-town-avatars"
```

### Phase 2: Workers AI Binding
```toml
# Add to wrangler.toml
[ai]
binding = "AI"
```

### Phase 3: Worker Endpoint
```javascript
// worker/src/handlers/photo-upload.js

export async function handlePhotoUpload(request, env) {
  const formData = await request.formData();
  const photo = formData.get('photo');
  const snakeId = formData.get('snake_id');
  const userId = formData.get('user_id');
  const species = formData.get('species');
  const morph = formData.get('morph');
  
  // 1. Save original to R2
  const photoKey = `${userId}/${snakeId}/original.jpg`;
  await env.PHOTOS.put(photoKey, photo.stream());
  
  // 2. Generate AI avatar
  const prompt = `cute pixel art ${species} snake avatar, ${morph} morph, 
                  cartoon style, simple background, kawaii, adorable`;
  
  const aiResponse = await env.AI.run(
    '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    {
      prompt,
      num_inference_steps: 20,
      guidance_scale: 7.5
    }
  );
  
  // 3. Save avatar to R2 (multiple sizes)
  const avatarKey = `${userId}/${snakeId}/avatar-512.png`;
  await env.AVATARS.put(avatarKey, aiResponse);
  
  // 4. Create thumbnails (64x64, 128x128)
  // TODO: Use Cloudflare Images API for resizing
  
  // 5. Save metadata to KV
  const photoData = {
    original_url: `https://photos.serpenttown.com/${photoKey}`,
    avatar_urls: {
      small: `https://avatars.serpenttown.com/${userId}/${snakeId}/avatar-64.png`,
      medium: `https://avatars.serpenttown.com/${userId}/${snakeId}/avatar-128.png`,
      large: `https://avatars.serpenttown.com/${userId}/${snakeId}/avatar-512.png`
    },
    generated_at: new Date().toISOString(),
    ai_model: 'stable-diffusion-xl',
    prompt_used: prompt
  };
  
  await env.SERPENT_TOWN_KV.put(
    `snake:${snakeId}:photos`,
    JSON.stringify(photoData)
  );
  
  return new Response(JSON.stringify({
    success: true,
    snake_id: snakeId,
    avatar_urls: photoData.avatar_urls
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Phase 4: Frontend Upload UI
```javascript
// Add to game-controller.js

async uploadSnakePhoto(snakeId, photoFile) {
  const snake = this.gameState.snakes.find(s => s.id === snakeId);
  if (!snake) return;
  
  const formData = new FormData();
  formData.append('photo', photoFile);
  formData.append('snake_id', snakeId);
  formData.append('user_id', this.userId);
  formData.append('species', snake.species);
  formData.append('morph', snake.morph);
  
  this.showNotification('🎨 Generating AI avatar...', 'info');
  
  const response = await fetch('/api/upload-snake-photo', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Update snake with avatar URLs
    snake.avatar_urls = result.avatar_urls;
    snake.has_custom_avatar = true;
    
    this.saveGame();
    this.render();
    this.showNotification('✅ Avatar generated!', 'success');
  }
}

// Add photo upload button to snake detail modal
showSnakeDetailModal(snakeId) {
  // ... existing code ...
  
  // Add upload button
  const uploadBtn = modal.querySelector('.upload-photo-btn');
  uploadBtn?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      await this.uploadSnakePhoto(snakeId, file);
      modal.remove();
    }
  });
}
```

### Phase 5: Display Custom Avatars
```javascript
// Update getSnakeAvatar utility

export function getSnakeAvatar(snake) {
  // Use custom AI-generated avatar if available
  if (snake.has_custom_avatar && snake.avatar_urls) {
    return {
      type: 'image',
      url: snake.avatar_urls.medium, // 128x128
      state: snake.stats.health < 30 ? 'sick' : 'healthy'
    };
  }
  
  // Fallback to emoji avatars
  return getEmojiAvatar(snake);
}
```

---

## 💰 Cost Analysis

### Cloudflare Workers AI (FREE Tier)
- **10,000 neurons/day** included free
- SDXL uses ~100 neurons per image
- **~100 AI avatars/day for FREE**
- Additional: $0.011 per 1,000 neurons

### Cloudflare R2 Storage
- **10 GB free** storage
- **10 million reads/month** free
- Photos: ~2-5 MB each
- Avatars: ~50 KB each
- **Can store 1,000+ snakes easily**

### Cloudflare Images (Optional)
- First 100k images delivered: **FREE**
- Perfect for thumbnails/variants

**Total Monthly Cost: $0 for small/medium usage!**

---

## 🎯 Alternative Options

### Option B: Hugging Face Inference API
```javascript
// Free tier, rate limited

const response = await fetch(
  'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: prompt,
      options: { wait_for_model: true }
    })
  }
);
```

### Option C: RemBG for Background Removal
```javascript
// Remove snake photo background before AI generation
const removeBg = await env.AI.run(
  '@cf/remove-bg',
  { image: photoBuffer }
);
```

---

## 🧪 Testing Plan

1. **Upload UI Test**
   - File picker works
   - Preview shows correctly
   - Progress indicator displays

2. **Worker Test**
   - Photo saves to R2
   - AI generation completes
   - Metadata saves to KV
   - Returns correct URLs

3. **Display Test**
   - Custom avatars show in snake cards
   - Fallback to emoji if no custom avatar
   - Images load from CDN quickly

4. **Error Handling**
   - Large file rejected (>5MB)
   - Invalid format rejected
   - AI timeout handled gracefully
   - User sees helpful error messages

---

## 📋 TODO Checklist

- [ ] Create R2 buckets (photos, avatars)
- [ ] Add Workers AI binding to wrangler.toml
- [ ] Implement photo upload endpoint
- [ ] Add frontend upload UI
- [ ] Update getSnakeAvatar to use custom images
- [ ] Add image resizing/thumbnails
- [ ] Test AI avatar generation quality
- [ ] Add "regenerate avatar" option
- [ ] Cache avatars in browser
- [ ] Add avatar gallery view

---

## 🎨 AI Prompt Templates

```javascript
const promptTemplates = {
  pixel_art: `cute pixel art ${species} snake, ${morph}, 8-bit style, 
              simple background, retro game sprite`,
              
  kawaii: `adorable kawaii ${species} snake, ${morph} colors, 
           chibi style, big eyes, simple background, cute`,
           
  realistic: `beautiful ${species} snake, ${morph} pattern, 
              professional photo, natural lighting, clean background`,
              
  cartoon: `cartoon ${species} snake character, ${morph}, 
            friendly expression, simple shapes, flat colors`,
            
  minimalist: `minimalist ${species} snake icon, ${morph}, 
               simple geometric design, flat style, single color bg`
};
```

---

**Next Steps:**
1. Set up R2 buckets
2. Test Workers AI with sample prompts
3. Build upload UI prototype
4. Test full pipeline end-to-end
