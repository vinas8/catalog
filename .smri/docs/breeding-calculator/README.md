# 🧬 Breeding Calculator - SMRI

**Version:** 0.7.2  
**Last Updated:** 2026-01-04  
**Code Location:** `/debug/breeding-calculator.html`

---

## 📋 Quick Reference

### Current Status
- **Phase 1:** ✅ Complete (basic scoring, lethal checks)
- **Phase 2:** 📋 Planned (advanced genetics)
- **Code File:** 1092 lines HTML/JS

### Configuration (In Code)
All constants live in `/debug/breeding-calculator.html`:

```javascript
// Lines 793-796: Lethal combos
const LETHAL_COMBOS = [...]

// Lines 799-810: Market values
const MORPH_VALUES = {...}

// Lines 813-867: calculateCompatibility()
function calculateCompatibility(male, female) {...}
```

**Current Scoring:**
- Age < 2 years: **-15 pts**
- Size diff > 500g: **-20 pts**
- Clutch value > $2000: **+20 pts**
- Lethal combo: **Score 0 (FATAL)**

---

## 📁 SMRI Files

This folder contains research and implementation guides:

### 1. **formulas.md** (Main Algorithms)
Research-based formulas ready for Phase 2:
- Inbreeding Coefficient (CoI) - Wright's formula
- Genetic Diversity scoring
- Heterozygosity calculations
- Health risk assessment
- **→ To be implemented in `calculateCompatibility()`**

### 2. **research.md** (Scientific Sources)
Academic and professional sources:
- Wright's CoI formula (1922)
- Reptile genetics literature
- Professional breeder guidelines
- Health studies (spider wobble, etc.)

### 3. **implementation.md** (Roadmap)
4-phase development plan:
- Phase 1: ✅ Basic (current)
- Phase 2: 🚧 Advanced genetics (next)
- Phase 3: 📋 Professional features
- Phase 4: 💡 AI/ML

---

## 🎯 Quick Start

**View Current Calculator:**
```bash
http://localhost:8000/debug/breeding-calculator.html
```

**Debug Console:** Shows generation stats in green box

**Read Research:**
- `formulas.md` - Math & algorithms
- `research.md` - Scientific backing
- `implementation.md` - Development plan

**Modify Calculator:**
Edit `/debug/breeding-calculator.html` (lines 792-1092)

---

## 🔗 Links

- **Code:** `/debug/breeding-calculator.html`
- **Main Docs:** `.smri/docs/breeding-calculator.md` (archived)
- **Related:** `.smri/research/snake-game-genetics.js`

---

**Navigation:**  
← [.smri/INDEX.md](../../INDEX.md) | [Formulas →](formulas.md) | [Research →](research.md)
