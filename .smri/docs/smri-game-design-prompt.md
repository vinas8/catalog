# SMRI Game Design Prompt - Pokédex/Stardew Valley Style

## Context
You are building a **town navigation hub** for a snake breeding game that connects multiple existing HTML modules (shop, dex, collection, game, calculator, breeding, tutorial, admin).

The visual style must match **Pokémon (Pokédex interface)** + **Stardew Valley (town/farm aesthetic)**.

---

## Visual References

### Pokédex Style Elements
From: https://github.com/veekun/pokedex

**Key UI Patterns:**
1. **Grid-based browsing** - Pokemon listed in structured grid with icons
2. **Detailed stats panels** - Height, weight, type, abilities in clean boxes
3. **Color-coded categories** - Types have distinct colors (fire=red, water=blue)
4. **Sprite-based graphics** - Small pixel art icons for each entry
5. **Search/filter bars** - Top navigation with species/type filters
6. **Red/white/black color scheme** - Primary Pokédex colors
7. **Numbered entries** - "#001 Bulbasaur" format
8. **Evolution chains** - Visual progression arrows
9. **Move lists** - Tabular data with level/TM info
10. **Flavor text** - Game descriptions in styled boxes

**Data Structure:**
```csv
id,identifier,species_id,height,weight,base_experience
1,bulbasaur,1,7,69,64
2,ivysaur,2,10,130,142
```

### Stardew Valley Style Elements

**Key Visual Features:**
1. **Top-down pixel art** - 16x16 or 32x32 tile grid
2. **Nature colors** - Grass green (#88c070), dirt brown (#b8945f), sky blue (#87ceeb)
3. **Cozy buildings** - Small wooden structures with thatched roofs
4. **Shadow depth** - Pseudo-3D with drop shadows
5. **Rounded corners** - Soft, friendly UI elements
6. **Golden accents** - Currency, highlights, important items
7. **Tile-based world** - Grid layout for navigation
8. **Seasonal palettes** - Can adjust colors for mood
9. **Thick borders** - 3-4px solid borders (#3d2817)
10. **Hand-drawn feel** - Slightly imperfect, organic shapes

---

## Technical Requirements

### Data Structure (Like Pokédex CSV)
```javascript
const snakes = [
    {
        id: 1,
        identifier: "normal_ball_python",
        species_id: 1,
        morph: "Normal",
        price: 50,
        rarity: "common"
    },
    {
        id: 2,
        identifier: "banana_ball_python",
        species_id: 1,
        morph: "Banana",
        price: 150,
        rarity: "uncommon"
    }
];
```

### Navigation Hub Architecture
```
smri-game/
└── index.html (SINGLE FILE)
    ├── Inline CSS (Stardew Valley style)
    ├── Inline JS (navigation logic)
    └── Links to existing modules:
        ├── /catalog/catalog.html (Shop)
        ├── /catalog/dex.html (Snake Dex - Pokédex style!)
        ├── /catalog/collection.html
        ├── /catalog/game.html
        ├── /catalog/calculator.html
        ├── /catalog/calc/index.html (Breeding)
        ├── /catalog/tutorial/index.html
        └── /catalog/admin-kv.html
```

---

## Visual Design Specifications

### Color Palette (Stardew Valley)
```css
:root {
    /* Nature colors */
    --grass-green: #88c070;
    --dark-green: #306850;
    --dirt-brown: #b8945f;
    --wood-brown: #8b6f47;
    --sky-blue: #87ceeb;
    
    /* UI colors */
    --ui-bg: #f5e6d3;
    --ui-border: #3d2817;
    --ui-text: #2d1b00;
    --gold: #ffd700;
    
    /* Pokédex colors */
    --pokedex-red: #dc0a2d;
    --pokedex-blue: #0075be;
    --pokedex-yellow: #ffcb05;
}
```

### Typography
```css
/* Pokédex style - clean, readable */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;

/* Stardew Valley - slightly rounded */
font-family: 'Comic Sans MS', 'Arial Rounded MT', sans-serif;

/* Retro pixel font (optional) */
font-family: 'Press Start 2P', monospace;
```

### Button Style (Stardew Valley 3D effect)
```css
.building {
    background: linear-gradient(135deg, #fff 0%, #f5e6d3 100%);
    border: 5px solid #3d2817;
    border-radius: 20px;
    box-shadow: 
        0 8px 0 #2d1b00,           /* 3D depth */
        0 10px 25px rgba(0,0,0,0.3); /* Shadow */
    transition: all 0.2s ease;
}

.building:hover {
    transform: translateY(-10px);
    box-shadow: 
        0 18px 0 #2d1b00,
        0 20px 35px rgba(0,0,0,0.4);
}

.building:active {
    transform: translateY(4px);
    box-shadow: 
        0 2px 0 #2d1b00,
        0 4px 15px rgba(0,0,0,0.3);
}
```

### Grid Layout (Top-down town map)
```css
.buildings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
    background: 
        linear-gradient(180deg, #87ceeb 0%, #88c070 50%),
        repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 32px,
            rgba(0,0,0,0.05) 32px,
            rgba(0,0,0,0.05) 34px
        );
}
```

---

## Example HTML Structure

### Town Map Screen (Main Hub)
```html
<div class="town-container">
    <!-- Stardew Valley header -->
    <div class="header">
        <h1>🐍 Serpent Town</h1>
        <p>Your Snake Breeding Adventure</p>
    </div>
    
    <!-- Pokédex-style status bar -->
    <div class="status-bar">
        <div class="stat">
            <span class="icon">💰</span>
            <span class="label">Gold</span>
            <span class="value">150</span>
        </div>
        <div class="stat">
            <span class="icon">🐍</span>
            <span class="label">Snakes Owned</span>
            <span class="value">3/800</span>
        </div>
    </div>
    
    <!-- Buildings grid (Stardew Valley) -->
    <div class="buildings-grid">
        <div class="building" onclick="navigate('/catalog/catalog.html')">
            <div class="building-icon">🏪</div>
            <div class="building-name">Snake Shop</div>
            <div class="building-desc">Buy real ball pythons</div>
        </div>
        
        <div class="building" onclick="navigate('/catalog/dex.html')">
            <div class="building-icon">📖</div>
            <div class="building-name">Snake Dex</div>
            <div class="building-desc">Encyclopedia of all 800+ morphs</div>
        </div>
        
        <!-- More buildings... -->
    </div>
</div>
```

### Snake Dex Screen (Pokédex Style)
```html
<div class="pokedex-container">
    <!-- Red Pokédex header -->
    <div class="pokedex-header">
        <div class="pokedex-light"></div>
        <h1>Snake Dex</h1>
        <div class="pokedex-counter">001/800</div>
    </div>
    
    <!-- Search bar -->
    <div class="search-bar">
        <input type="text" placeholder="Search snakes...">
        <select>
            <option>All Species</option>
            <option>Ball Python</option>
            <option>Corn Snake</option>
        </select>
    </div>
    
    <!-- Grid of snakes -->
    <div class="pokemon-grid">
        <div class="pokemon-card owned">
            <div class="pokemon-number">#001</div>
            <div class="pokemon-sprite">🐍</div>
            <div class="pokemon-name">Normal Ball Python</div>
            <div class="pokemon-types">
                <span class="type type-normal">Normal</span>
            </div>
        </div>
        
        <div class="pokemon-card locked">
            <div class="pokemon-number">#002</div>
            <div class="pokemon-sprite">❓</div>
            <div class="pokemon-name">???</div>
        </div>
    </div>
</div>
```

---

## Implementation Checklist

### Phase 1: Town Hub (Stardew Valley)
- [ ] Sky-to-grass gradient background
- [ ] Grid-based building layout
- [ ] 3D button effects (drop shadows)
- [ ] Thick borders (#3d2817, 4-5px)
- [ ] Building icons (emoji 5rem)
- [ ] Hover animations (lift effect)
- [ ] Click animations (press down)
- [ ] Golden accents for currency
- [ ] Rounded corners (16-20px)
- [ ] Cozy color palette

### Phase 2: Snake Dex (Pokédex Style)
- [ ] Red/white/black color scheme
- [ ] Pokédex light animation (pulsing blue)
- [ ] Grid of snake entries
- [ ] Numbered format (#001, #002...)
- [ ] Owned vs locked states
- [ ] Type badges (colored pills)
- [ ] Search/filter functionality
- [ ] Detailed stat panels
- [ ] Evolution chains
- [ ] Flavor text descriptions

### Phase 3: Data Integration
- [ ] CSV-style data structure
- [ ] Snake species database
- [ ] Morph variations
- [ ] Stats (height, weight, price)
- [ ] Rarity tiers
- [ ] Type system
- [ ] Breeding compatibility
- [ ] Growth stages

---

## Success Criteria

Your SMRI game succeeds when:

1. **Looks like Pokédex** - Red/white theme, numbered entries, sprite grid
2. **Feels like Stardew Valley** - Cozy colors, 3D buttons, nature theme
3. **Single file** - All HTML/CSS/JS inline for simplicity
4. **Navigates cleanly** - Click building → go to real module
5. **Data-driven** - Uses structured data like Pokédex CSV
6. **Responsive** - Works on mobile and desktop
7. **Fast** - Loads instantly, no dependencies

---

## Reference Links

- Pokédex repo: https://github.com/veekun/pokedex
- Pokédex data: `/pokedex/data/csv/*.csv`
- Stardew Valley colors: Grass green, dirt brown, gold accents
- Key pattern: **Data structure (Pokédex) + Visual style (Stardew Valley)**

---

## Final Prompt for AI

"Create a single-file HTML game hub styled like Stardew Valley (cozy farm aesthetic, 3D buttons, nature colors) with Pokédex-inspired data structure (CSV-based, numbered entries, sprite grid). The hub connects to 9 existing modules via onclick navigation. Use inline CSS/JS, no external dependencies. Buildings should have thick borders, drop shadows, and hover/press animations. Include a status bar, gradient sky-to-grass background, and emoji icons. Make it feel professional and game-like, not minimal."
