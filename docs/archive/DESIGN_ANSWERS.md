# 🐍 Serpent Town - Design Decisions Summary

**All 100 questions answered from voice recording 2025-12-21**

---

## 🎯 CORE VISION

**Q1-4: Purpose & Audience**
- **Goal**: Educational + Sales (A+B combo)
- **Audience**: Mixed - farm owners, hobbyists, kids, gamers, potential buyers
- **Realism**: SIMULATOR level - as realistic as possible
- **Business**: Real purchases = snake cards (collectibles) + virtual snakes

**Q5-7: Platform & Style**
- **Timeline**: ASAP (quick MVP)
- **Platform**: Web first (GitHub Pages) → mobile app later
- **Style**: Card game + Tamagotchi + RPG (Stardew Valley-like)

**Q8-10: Engagement**
- **Time**: Casual + Vacation Mode (NPC care when away)
- **Failure**: Snake can die/get sick realistically
- **Breeds**: MORPH-SPECIFIC (very detailed)

**Q11-16: Social & Content**
- **Progression**: Care tasks + real purchases (no traditional leveling)
- **Social**: Chat, trading, friends, community events
- **Education**: Basic→Advanced (plugins for morph logic later)
- **Monetization**: Drive real sales + equipment bonuses
- **Success**: Conversion + retention + community growth
- **Updates**: Quarterly breeds, seasonal events, UGC later

---

## 🐍 SNAKE CARE MECHANICS (ALL REALISTIC)

**Stats to Track**:
- Hunger, hydration, temperature (slider), humidity (breed-specific)
- Stress (handling), health (no random illness)
- Weight/growth, shed cycle (visible stages, complications)

**Core Systems**:
- **Feeding**: Live/frozen, prey choice, age-dependent, seasonal, required intervals
- **Temperature**: Realistic zones with slider control
- **Humidity**: Impacts shedding, breed-specific
- **Shedding**: Visible stages, educational, can have stuck shed
- **Health**: Illness only from neglect/wrong care
- **Enclosure**: Customizable, realistic equipment
- **Growth**: Full lifecycle (hatchling→adult), affects needs
- **Handling**: Builds trust over time, causes stress if excessive
- **Breeding**: FULL SIMULATOR - genetics calculator, seasons, incubation
- **Quarantine**: New snakes isolated, check parasites, costs money/time

---

## 🎮 GAMEPLAY STRUCTURE

### **Main Interface: TOWN HUB**
1. **Your House** - Snake collection view
2. **Shop** - Buy snakes (Stripe) + equipment
3. **Other Houses** - Visit friends' collections
4. **NPC Services** - Vet, vacation care
5. **Community** - Chat/forum

### **House View**
- See all snakes in enclosures (20-50 per room)
- Click snake → Tamagotchi mode

### **Tamagotchi Mode** (Individual Snake Care)
- Snake card with detailed stats
- Feed, water, clean, temp/humidity sliders
- Monitor health, shed, weight
- Breeding interface

### **Time System**
- Real-time + fast-forward (seasons)
- Choose season in game
- Vacation mode = pause with NPC care

### **Daily Tasks**
- Quick care (2-10 min) OR extended play (chat, community)
- Notifications: Strategic (business), not basic feeding

---

## 💰 ECONOMY & PROGRESSION

**Currency**:
- In-game currency from cash conversion
- Buy snake → get points for in-game care
- Earn through: offspring sales, care quality

**Spending**:
- Snakes, food, equipment, enclosures, cosmetics

**Progression**:
- **Loyalty levels** (not traditional XP) = shop discounts
- Experience from care and learning
- No skill trees

**Collection**:
- MAIN GAME GOAL
- Unlimited snakes (buy rooms for 20-50 each)
- Achievement = healthy, large collection

**Trading & Social**:
- Add friends, visit collections
- Full trading system
- Leaderboards
- Community events (like e-commerce promos)

---

## 📚 EDUCATION SYSTEM

**Delivery**:
- Initial tutorial + contextual help for new functions
- Encyclopedia (reference)
- Quizzes → pass for level/experience

**Content**:
- Show consequences of neglect + tips to fix
- Basic→Advanced progression (school-like)
- Two learning paths:
  1. Generic snake care
  2. Morph breeding
- Can skip if experienced

**Emergencies**:
- Vet system (costs money, takes time)

**No External Links** - all content in-game

---

## 🔧 TECHNICAL STACK

**Infrastructure**:
- **Frontend**: GitHub Pages
- **Backend**: Cloudflare Worker
- **Payments**: Stripe payment links
- **Media**: Uploadable snake photos (Stripe products)
- **Multiplayer**: Consider Go game engine + Cloudflare

**Data**:
- Log every action
- Save frequently
- Cross-device sync (web-based)
- Offline mode = disable multiplayer/chat

**Assets**:
- **Now**: Static PNG images
- **Later**: Animations, audio

**Performance**:
- Small bundle, fast loading
- Modern browsers (support older if simple)
- Mobile optimized

**Features for Later**:
- Audio
- Complex animations
- Full accessibility (if possible now, do it)
- Localization support

---

## 🧬 BREEDING & GENETICS

**Full Simulator**:
- Species-specific age + weight requirements
- Seasonal breeding (choose season)
- Realistic egg incubation (can fast-forward)
- **Genetics calculator**: Dominant/recessive traits
- Line breeding consequences (educational/ethical)
- Keep or sell offspring
- Realistic market economy

---

## 🎨 UI/UX

**Visuals**:
- Static PNG now, animated later
- Snake cards with detailed stats
- Progress bars + numbers + realistic gauges

**Interaction**:
- Tap, drag-and-drop, buttons
- Intuitive mobile controls

**Inventory**:
- Auto-add purchases to house
- Equipment management

**Help**:
- Multiplayer chat = community help
- Tutorial system
- Encyclopedia

**Analytics**: Later phase

---

## 📋 IMPLEMENTATION PHASES

### **Phase 1 - MVP (NOW)**:
✅ Basic town hub (house + shop)
✅ Single snake Tamagotchi (card-based)
✅ Core stats: hunger, water, temp, humidity
✅ Stripe shop integration
✅ LocalStorage save system
✅ Basic tutorial

### **Phase 2**:
- Multiple snake collection (rooms)
- Breeding basics (no genetics yet)
- Health/shedding mechanics
- Equipment system
- Full encyclopedia

### **Phase 3**:
- Multiplayer/chat
- Trading system
- Full genetics calculator
- Vacation mode (NPC care)
- Community events

### **Phase 4+**:
- Animations & audio
- User-generated content
- Native mobile app
- Remote real snake care integration

---

## 🚀 NEXT STEPS

1. **Technical Architecture Document** - State machine, data models
2. **Game State Design** - Snake object schema, save format
3. **Core Loop Implementation** - Town → House → Tamagotchi
4. **Stripe Integration** - Product upload, webhook handling
5. **UI Mockups** - Town hub, snake card, care interface

**Ready to proceed with implementation!**

---

**Status**: Complete design specification
**Date**: 2025-12-21
**Voice recording transcribed and analyzed**
