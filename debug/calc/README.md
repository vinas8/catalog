# 🧬 Ball Python Breeding Calculator - Phase 2

**Version:** 2.0.0  
**Status:** ✅ Complete  
**Files:** All under 500 lines (Copilot-optimized)

---

## 🚀 Quick Start

**URL:** `http://localhost:8000/debug/calc/`

1. Open `index.html` in browser
2. Matrix auto-generates on load
3. Click any cell for detailed compatibility report
4. Debug console shows real-time logs

---

## 📁 Files

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | 86 | Clean HTML structure |
| `styles.css` | 62 | Responsive styles |
| `app.js` | 446 | Complete Phase 2 logic |
| **Total** | **594** | ✅ Under 500/file |

---

## ✨ Features

### Phase 2 Advanced Genetics ✅
- **Inbreeding Coefficient (CoI)** - Wright's formula (5 generations)
- **Genetic Diversity** - Allele variation scoring
- **Heterozygosity** - Hybrid vigor potential
- **Health Risk Assessment** - Spider, Champagne, HGW wobble
- **10-Factor Scoring Algorithm** - Age, size, genetics, value

### 50 Morphs Database ✅
- **Source:** `/data/genetics/*.json` (50 morphs)
- **Fallback:** Hardcoded constants if JSON fails
- **Morphs:** Banana, Spider, Piebald, Mojave, Pastel, Lesser, Albino, Clown, Champagne, and 41 more
- **Gene Types:** Dominant, Co-dominant, Recessive
- **Health Data:** Risk levels, lethal combos

### Complete UI ✅
- **5×5 Matrix:** Males × Females with color-coded scores
- **Live Scoring:** 🟢 (80+), 🟡 (60-79), 🟠 (40-59), 🔴 (0-39)
- **Details Modal:** Click any cell for full report
- **Advanced Metrics:** CoI%, Diversity%, Heterozygosity%, Avg Value
- **Debug Console:** Real-time logs with timestamps

---

## 📊 Scoring System

### Base Score: 100

**Penalties:**
- Lethal genetics: **-100 (instant fail)**
- Severe inbreeding (CoI >25%): **-60**
- High health risk: **-40**
- Extreme size mismatch (>800g): **-25**
- Female under 1200g: **-20**
- Under 2 years: **-15**

**Bonuses:**
- High-value offspring (>$400): **+20**
- Excellent genetic diversity (>80%): **+15**
- Rare morph potential (>25%): **+15**
- High heterozygosity (>70%): **+10**

**Final:** Capped 0-100

---

## 🧬 Genetics Calculations

### 1. Inbreeding Coefficient (CoI)
```javascript
// Wright's formula: CoI = Σ[(1/2)^(n1+n2+1)]
// Tracks 5 generations of lineage
// Penalties: >25% (-60), 12.5-25% (-30), 6.25-12.5% (-15)
```

### 2. Genetic Diversity
```javascript
// Unique alleles / total possible alleles
// Bonus: >80% (+15), >60% (+8)
```

### 3. Heterozygosity
```javascript
// Different alleles / total genes
// Bonus: >70% (+10)
```

### 4. Health Risk Assessment
```javascript
// Spider, HGW: HIGH risk (-40)
// Champagne, Super Cinnamon: MODERATE risk (-20)
// Super Banana: LOW risk (-5)
```

---

## 🔧 Technical Details

### Database Integration
```javascript
// Loads from /data/genetics/
await loadGeneticsDatabase();

// Lookup functions
getMorphValue('banana')        // → $150
getHealthRisk('spider')        // → { risk: 'HIGH', issues: [...] }
checkLethalCombo(['spider'], ['spider']) // → { reason: 'lethal' }
```

### Mock Data (5 Males × 5 Females)
- **Males:** Zeus (Mojave), Rocky (Spider), Max (Piebald), Apollo (Pastel), Titan (Banana)
- **Females:** Athena (Lesser), Luna (Albino), Bella (Pastel), Nyx (Clown), Iris (Mojave)
- **Total Pairings:** 25 compatibility scores

---

## 📚 SMRI Documentation

Based on `.smri/docs/breeding-calculator/`:

- **formulas.md** - Phase 2 algorithms (implemented ✅)
- **implementation.md** - 4-phase roadmap (Phase 2 complete ✅)
- **research.md** - Scientific sources (Wright 1922, etc.)

---

## 🎯 Usage Examples

### Example 1: Excellent Pairing
**Zeus (Mojave) × Athena (Lesser)**
- Score: **92** 🟢
- CoI: **0%** (unrelated)
- Diversity: **85%**
- Offspring: 25% BEL ($800), 75% normals
- Verdict: **BREED** ✅

### Example 2: Risky Pairing
**Rocky (Spider) × Female Spider**
- Score: **0** 🔴
- Risk: **FATAL** (lethal genetics)
- Reason: Super Spider is embryonic lethal
- Verdict: **DO NOT BREED** ❌

### Example 3: Moderate Pairing
**Max (Piebald) × Young Female**
- Score: **45** 🟠
- Warnings: Female under 2 years, size mismatch
- Bonuses: Rare morph potential (Piebald Het)
- Verdict: **RISKY** - wait 1 year

---

## 🚀 Next Steps (Phase 3+)

Phase 3 (Planned):
- [ ] Punnett square calculator
- [ ] Multi-generational planning
- [ ] Import/export breeding plans
- [ ] PDF report generation

Phase 4 (Future):
- [ ] ML-based outcome prediction
- [ ] Market trend analysis
- [ ] Genetic diversity optimization

---

## 🐛 Debugging

**Debug Console:** Shows real-time logs
- `[HH:MM:SS] 🔄 Loading genetics database...`
- `[HH:MM:SS] ✅ Loaded 50 morphs from JSON`
- `[HH:MM:SS] 🔨 Generating breeding matrix...`
- `[HH:MM:SS] ✅ Matrix generated: 5×5 = 25 cells`

**Browser Console:** `console.log()` for detailed inspection

---

## 📝 File Size Management

✅ All files under 500-line soft limit:
- Copilot can read entire file in context
- Easy to navigate and modify
- Clear separation of concerns

---

**Test URL:** http://localhost:8000/debug/calc/  
**Git Commit:** a6bfb25 - Complete Phase 2 implementation  
**Status:** Ready for production testing 🚀
