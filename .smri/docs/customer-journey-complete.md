# 🐍 Serpent Town - Complete Customer Journey System

**Version:** 0.7.0  
**Date:** 2026-01-02  
**Status:** Blueprint - Ready to Implement

---

## 🎯 Vision Summary

**Goal:** Transform curious visitors into confident snake collectors through playful, educational experiences.

**How:** Progressive tutorial game → Learn encyclopedia → Real snake collection on virtual shelves

---

## 🚪 Entry Point: Welcome Screen

### First Visit Detection
```javascript
if (new_customer) {
  show_welcome_screen();
} else if (has_virtual_snakes || has_real_snakes) {
  show_aquarium_shelves();
} else {
  show_tutorial_option();
}
```

### Welcome Options

**Option 1: Tutorial Game** (Recommended for new customers)
- "🎮 Learn with a Virtual Snake" button
- Instant start, no account required
- Get first virtual snake immediately

**Option 2: Browse & Shop** (For confident buyers)
- "🛒 Shop Real Snakes" button
- Direct to catalog
- Can return to tutorial anytime

**Option 3: Learn First** (For researchers)
- "📚 Read Encyclopedia" button
- Browse care guides
- No commitment

---

## 🎮 Tutorial Game System

### Concept: Time-Based Event Game

**Player gets a virtual snake and experiences real care scenarios as a game.**

### Game Loop

```
START
  ↓
Give customer virtual snake
  ↓
Time passes (simulated or real)
  ↓
EVENT occurs (snake gets hungry, thirsty, starts shedding, etc.)
  ↓
Customer clicks "Handle This Event"
  ↓
Mini-lesson teaches what to do
  ↓
Customer completes action
  ↓
Snake health improves
  ↓
Earn reward (points, badges, new virtual snake)
  ↓
REPEAT
```

### Tutorial Levels

**Level 1: Basic Care** (2-3 events)
- Event 1: Snake is hungry → Feed it
- Event 2: Snake is thirsty → Water dish
- Event 3: Enclosure dirty → Clean it
- **Reward:** 100 gold, confidence badge

**Level 2: Health Monitoring** (3-4 events)
- Event 1: Temperature too low → Adjust heater
- Event 2: Humidity too low → Mist enclosure
- Event 3: Snake hiding a lot → Reduce stress
- Event 4: Time to weigh snake → Track growth
- **Reward:** Second virtual snake, thermometer badge

**Level 3: Life Cycle** (3-4 events)
- Event 1: Snake in blue (pre-shed) → Recognize signs
- Event 2: Snake is shedding → Humidity management
- Event 3: Post-shed check → Ensure complete shed
- Event 4: Feeding after shed → Wait period
- **Reward:** Third virtual snake, breeding basics unlocked

**Level 4: Advanced Care** (4-5 events)
- Event 1: Breeding behavior → Recognize readiness
- Event 2: Egg laying → Incubator setup
- Event 3: Quarantine new snake → Health protocols
- Event 4: Vet visit needed → Recognize illness
- Event 5: Long-term planning → Growth projections
- **Reward:** Premium virtual snake, expert badge, 20% shop discount

### Tutorial Features

✅ **Click-through events** - Each event is one click to proceed  
✅ **Educational tooltips** - Learn while playing  
✅ **No time pressure** - Can pause anytime  
✅ **Progress saved** - Return anytime  
✅ **Collectible snakes** - Earn virtual collection  
✅ **Real scenarios** - Based on actual care needs  

---

## 📚 Learn Section (Encyclopedia)

### Structure

```
/learn
├── Getting Started
│   ├── Choosing Your First Snake
│   ├── Essential Equipment
│   └── Setting Up Enclosure
├── Daily Care
│   ├── Feeding Guide
│   ├── Water & Humidity
│   ├── Temperature Control
│   └── Cleaning Schedule
├── Health & Wellness
│   ├── Shedding Process
│   ├── Common Health Issues
│   ├── When to See a Vet
│   └── Handling & Socialization
├── Life Cycle Events
│   ├── Growth Stages
│   ├── Breeding Basics
│   ├── Egg Incubation
│   └── Hatching & Care
└── Species Guide
    ├── Ball Pythons
    ├── Corn Snakes
    └── [More species...]
```

### Content Format

Each article includes:
- 📖 **Written guide** (2-3 minute read)
- 🎮 **Interactive demo** (optional mini-game)
- ✅ **Checklist** (printable/saveable)
- 💡 **Pro tips** (from experienced keepers)
- 🔗 **Related topics** (navigation)

### Search & Filter

- Search by keyword
- Filter by snake species
- Filter by care stage (beginner, intermediate, advanced)
- Bookmark favorites

---

## 🏠 Aquarium Shelf Collection (Post-Tutorial)

### After Tutorial Completion

Customer now has:
- 3-4 virtual snakes (from tutorial rewards)
- Basic care knowledge
- Confidence to care for real snakes
- 20% discount code for first purchase

### Shelf View

```
┌────────────────────────────────────┐
│  Your Collection  |  🧹 Clean All  │
├────────────────────────────────────┤
│ Virtual Snakes (From Tutorial)     │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐           │
│ │🐍 │ │😊 │ │🐍 │ │🐍 │           │
│ └───┘ └───┘ └───┘ └───┘           │
│ Tutorial Rewards                    │
├────────────────────────────────────┤
│ Real Snakes (Ready to Buy)         │
│ [Empty - Click to Shop] 🛒         │
└────────────────────────────────────┘
```

### Transition to Real Snakes

- Virtual and real snakes displayed on same shelves
- Clear visual distinction (border color, badge)
- Virtual snakes stay forever (collection achievement)
- Real snakes have full stats tracking

---

## 🛒 Shopping Flow (After Tutorial)

### Confident Buyer Journey

```
Tutorial Complete
  ↓
Customer clicks "🛒 Shop Real Snakes"
  ↓
Browse catalog (with new confidence!)
  ↓
Select snake
  ↓
Apply 20% tutorial discount
  ↓
Stripe checkout
  ↓
Real snake appears in aquarium shelf
  ↓
Virtual snakes still there (for reference)
  ↓
Customer is now confident collector
```

---

## 📊 Full Customer Journey Map

### Path A: Tutorial → Shop (Recommended)

```
1. Welcome Screen
   ↓
2. "Learn with Virtual Snake" button
   ↓
3. Tutorial Game (4 levels, ~10-15 minutes)
   ↓
4. Earn 3-4 virtual snakes + 20% discount
   ↓
5. "Ready to Shop?" prompt
   ↓
6. Browse catalog with confidence
   ↓
7. Purchase real snake
   ↓
8. Real + virtual snakes on same shelf
   ↓
9. Customer becomes repeat buyer
```

### Path B: Direct Shop (Experienced buyers)

```
1. Welcome Screen
   ↓
2. "Shop Real Snakes" button
   ↓
3. Browse catalog
   ↓
4. Purchase real snake
   ↓
5. Real snake on shelf
   ↓
6. Optional: Try tutorial later
```

### Path C: Learn First (Researchers)

```
1. Welcome Screen
   ↓
2. "Read Encyclopedia" button
   ↓
3. Browse care guides
   ↓
4. Gain confidence
   ↓
5. Return to shop OR start tutorial
```

---

## 🎯 Success Metrics

### Tutorial Completion
- % of customers who start tutorial
- % who complete all 4 levels
- Average time to complete
- Drop-off points

### Conversion Rate
- Tutorial → Shop conversion
- Direct shop conversion
- Learn → Shop conversion

### Retention
- Customers with virtual snakes (tutorial grads)
- Customers with real snakes (purchases)
- Repeat purchase rate

---

## 🔧 Technical Implementation

### Pages

1. **index.html** (Welcome Screen)
   - Route new vs. returning customers
   - 3 clear CTAs (Tutorial, Shop, Learn)

2. **learn.html** (Tutorial Game)
   - Progressive event-based tutorial
   - Earn virtual snakes
   - Save progress

3. **learn-static.html** (Encyclopedia)
   - Searchable care guides
   - Species profiles
   - Interactive demos

4. **game.html** (Aquarium Shelves)
   - Display virtual + real snakes
   - Shelf management system
   - Clean All functionality

5. **catalog.html** (Shop)
   - Browse real snakes
   - Apply tutorial discount
   - Stripe checkout

### Data Flow

```javascript
Customer {
  id: 'user-123',
  tutorial_complete: true,
  virtual_snakes: [
    { id: 'v1', nickname: 'Tutorial Snake 1' },
    { id: 'v2', nickname: 'Tutorial Snake 2' },
    { id: 'v3', nickname: 'Tutorial Snake 3' }
  ],
  real_snakes: [
    { id: 'r1', nickname: 'My First Real Snake' }
  ],
  tutorial_discount: '20OFF-TUTORIAL',
  tutorial_started_at: '2026-01-02T10:00:00Z',
  tutorial_completed_at: '2026-01-02T10:15:00Z'
}
```

---

## 🎨 UI/UX Design Principles

### Welcome Screen
- **Friendly** - Not intimidating
- **Clear CTAs** - 3 buttons, obvious choices
- **Fast** - No long forms, instant start

### Tutorial Game
- **Fun** - Like a mobile game
- **Educational** - Learn by doing
- **Rewarding** - Virtual snakes + badges
- **Quick** - 10-15 minutes total

### Encyclopedia
- **Searchable** - Find info fast
- **Visual** - Photos, diagrams, videos
- **Actionable** - Checklists, guides
- **Always accessible** - Link from everywhere

### Aquarium Shelves
- **Visual** - See your collection
- **Mixed** - Virtual + real snakes together
- **Organized** - Shelves keep it clean
- **Interactive** - Click to see details

---

## 💡 Key Insights

1. **Tutorial builds confidence** - Customers who learn first are more likely to buy
2. **Virtual snakes lower risk** - Practice before buying real
3. **Encyclopedia removes anxiety** - Always have answers
4. **Discount rewards learning** - 20% off incentivizes completion
5. **Shelves show progress** - Visual achievement system

---

## 🚀 Implementation Priority

### Phase 1: Core Tutorial (P0)
- [ ] Welcome screen with 3 CTAs
- [ ] Tutorial game (4 levels)
- [ ] Virtual snake rewards
- [ ] Discount code system

### Phase 2: Aquarium Integration (P0)
- [ ] Display virtual + real snakes together
- [ ] Shelf system (already built ✅)
- [ ] Tutorial completion tracking

### Phase 3: Encyclopedia (P1)
- [ ] Care guide articles
- [ ] Species profiles
- [ ] Search functionality

### Phase 4: Polish (P2)
- [ ] Achievement badges
- [ ] Progress tracking dashboard
- [ ] Social sharing (collection screenshots)

---

## 📝 SMRI Scenarios

**Related Scenarios:**
- `S2-tutorial-happy-path` ✅ (already exists)
- `S2-tutorial-missed-care` ✅ (already exists)
- `S2-aquarium-shelf-system` ✅ (already exists)
- `S1-welcome-screen-routing` (TODO)
- `S2-tutorial-game-loop` (TODO)
- `S2-encyclopedia-search` (TODO)

---

## 🎯 Business Impact

**Before:** Customers intimidated → hesitate → leave  
**After:** Customers learn → gain confidence → buy with ease

**Result:** Higher conversion, lower returns, happier customers, repeat buyers

---

**Status:** Blueprint complete, ready for implementation  
**Next Step:** Build welcome screen routing logic  
**Timeline:** Phase 1 (2-3 weeks), Phase 2 (1 week), Phase 3 (2 weeks)

---

**Built with ❤️ and 🐍**  
*"Transform visitors into confident collectors"*
