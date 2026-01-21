# 🤖 MACHINE PROMPT — SERPENT TOWN INTEGRATION

## ROLE

You are an autonomous senior frontend engineer + QA agent.

Your task is to integrate Dex, Morph Calculator, and MyFarm into one coherent, gamified demo system, then self-test and verify correctness.

**Vanilla JavaScript only.**  
**Static hosting (GitHub Pages).**  
**No backend. No frameworks.**

---

## GLOBAL CONSTRAINTS

- Use `/data/genetics/morphs-comprehensive.json` as single source of truth
- No duplicate morph databases
- Mobile-first
- Must run on GitHub Pages
- Ethics-first: lethal combos blocked, health warnings visible
- No pricing logic

---

## CORE STATE MODEL (REQUIRED)

Implement global persistent state:

```javascript
window.APP_STATE = {
  ownedSnakes: [],
  unlockedMorphs: [],
  demoProgress: {
    checkout: false,
    farm: false,
    dex: false,
    calculator: false
  }
};
```

Persist to localStorage. Restore on load.

---

## FLOW ARCHITECTURE (MANDATORY)

### FLOW ORDER

**CHECKOUT → MYFARM → DEX → CALCULATOR → COMPLETE**

Implement demo as a state machine, not hardcoded steps.

---

## CHECKOUT FLOW

On demo checkout:

1. Create demo snake:
   ```javascript
   {
     id: "demo_snake_001",
     name: "Demo Banana Spider",
     morphs: ["banana", "spider"],
     rarity: "demo"
   }
   ```

2. Add to `ownedSnakes`
3. Unlock its morphs
4. Mark `demoProgress.checkout = true`

---

## MYFARM

- Display owned snakes
- Each snake has:
  - "View in Dex" button

**Clicking:**
- Navigates to `/dex/`
- Marks `demoProgress.farm = true`

---

## DEX (MORPH ENCYCLOPEDIA)

### Data

- Load **only** `morphs-comprehensive.json`

### UI RULES

- All morphs visible
- **Locked morphs:** grayscale / silhouette
- **Unlocked morphs:** full color + badge
- Show progress: **Collected X / TOTAL**

### FEATURES

- Search
- Filter by gene type
- Filter locked / unlocked
- Each morph entry includes:
  - Health risk
  - Breeding notes
  - Button: **"Try in Calculator"**

**Clicking button:**
- `/calc/?male=banana&female=piebald`
- Mark `demoProgress.dex = true`.

---

## MORPH CALCULATOR

### FUNCTIONAL REQUIREMENTS

- Genetics only (dominant / co-dom / recessive)
- Supports:
  - Supers
  - Het logic
  - Lethal combo prevention
  - Health warnings

### URL PARAM SUPPORT (MANDATORY)

- Auto-load parents from query params
- Auto-calculate on load

### VISUALIZATION

- CSS Grid Punnett Square
- Outcome cards:
  - Morph name
  - Probability %
  - Health flags

Mark `demoProgress.calculator = true`.

---

## DEMO SYSTEM

- Sidebar showing flow steps
- Current step highlighted
- Steps unlock only when prior state satisfied
- No iframe scripting assumptions

---

## SELF-TESTING (REQUIRED)

You must verify before completion:

### Tests

1. Demo checkout creates snake
2. MyFarm lists demo snake
3. Dex loads comprehensive DB
4. Demo morphs unlocked
5. Locked morphs visually distinct
6. Dex → Calculator preselects morphs
7. Calculator auto-runs from URL
8. Lethal combo blocks calculation

### Method

- DOM-driven JS tests or headless browser
- Log PASS / FAIL
- Fix failures automatically

---

## OUTPUT REQUIREMENTS

- No console errors
- Clean, commented code
- All flows reachable without manual input
- Demo feels like: **collect → unlock → breed → learn**

---

## DO NOT

- Ask follow-up questions
- Add backend
- Add pricing
- Add frameworks

---

**END PROMPT**
