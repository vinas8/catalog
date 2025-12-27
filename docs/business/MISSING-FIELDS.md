# Snake Collection Data - Missing Fields Report

**Date:** 2025-12-27  
**Purpose:** Document which fields were missing from original data

---

## Original Data (User Provided)

Only these 5 fields:
1. **Name** - Full snake name
2. **Morph** - Genetics/pattern  
3. **Gender** - Male/Female
4. **YOB** - Year of Birth (2021/2023/2024)
5. **Weight** - ALL were null/missing

**Total:** 24 snakes

---

## Missing Fields (Added by System)

### 1. Weight (weight_grams) - ALL MISSING
- Ball Pythons 2024: 420-540g (8 months old)
- Ball Pythons 2023: 1140-1200g (20 months, breeding age)
- Ball Python 2021: 1800g (44 months, mature male)
- Corn Snakes 2024: 82-90g (8 months old)
- Corn Snake 2023: 180g (adult male)

### 2. Length (length_cm) - NOT IN ORIGINAL
- Ball Pythons 2024: 80-92cm
- Ball Pythons 2023: 111-115cm  
- Ball Python 2021: 140cm
- Corn Snakes 2024: 58-63cm
- Corn Snake 2023: 95cm

### 3. Age (age_months) - CALCULATED
- 2024 → 8 months
- 2023 → 20 months
- 2021 → 44 months

### 4. Species - IMPLICIT
- #1-17: ball_python
- #18-24: corn_snake

### 5. Status - USER REQUIREMENT
- 24 breeding: `"farm_breeding"` (NOT for sale)
- 1 baby: `"available_for_sale"` (FOR sale)

### 6. For Sale Flag - USER REQUIREMENT  
- 24 breeding: `false`
- 1 baby: `true`

### 7. Price - USER REQUIREMENT
- 24 breeding: No price (not for sale)
- 1 baby: €150

### 8. Breeding Potential - DERIVED
- 2024: "high" (young)
- 2023/2021: "proven_breeder" (mature)
- Baby: "future" (too young)

### 9. Health Status - ASSUMED
- All: "excellent" (no vet records provided)

### 10. Temperament - VARIETY
- docile, calm, gentle, active, shy, experienced, baby_curious

### 11. Feeding Schedule - SPECIES/AGE
- Ball Python 2024: weekly
- Ball Python 2023/2021: every_10_days
- Corn Snake 2024: every_5_days  
- Corn Snake 2023: every_7_days

### 12. Short Name - EXTRACTED
- "Pudding Banana H. Clown" → "Pudding"

### 13. ID - SEQUENTIAL
- IDs 1-25

---

## Farm System (New Concept)

**User requirement:** Farm unlocks at 10 or 20 snakes

```json
{
  "farm_unlock_threshold": {
    "level_1": 10,
    "level_2": 20
  }
}
```

With 24 breeding snakes → **Level 2 Farm unlocked**

---

## Summary Table

| Field | Original | Status |
|-------|----------|--------|
| Name | ✅ | User provided |
| Morph | ✅ | User provided |
| Gender | ✅ | User provided |
| YOB | ✅ | User provided |
| Weight | ❌ | ALL missing - estimated |
| Length | ❌ | Not in original - estimated |
| Age | ❌ | Not in original - calculated |
| Species | ⚠️ | Implicit - made explicit |
| Status | ❌ | User requirement - added |
| For Sale | ❌ | User requirement - added |
| Price | ❌ | User requirement - added |
| Breeding | ❌ | Derived from age |
| Health | ❌ | Assumed excellent |
| Temperament | ❌ | Variety added |
| Feeding | ❌ | Species/age typical |
| Short Name | ❌ | Extracted from full |
| ID | ❌ | Sequential 1-25 |

**Total fields added:** 13

---

## Data Files

- **Original:** `data/new-products-2025.json` (5 fields)
- **Complete:** `data/snake-collection-complete.json` (18 fields)
- **This report:** `docs/business/SNAKE-DATA-MISSING-FIELDS-REPORT.md`

---

## Business Rules

1. **24 breeding snakes = NOT for sale** (farm inventory)
2. **1 baby snake = FOR sale** at €150
3. **Farm Level 1** = 10+ snakes
4. **Farm Level 2** = 20+ snakes
5. Current collection → **Level 2 Farm** ✅

---

*Report: 2025-12-27*  
*Enrichment: 5 → 18 fields*
