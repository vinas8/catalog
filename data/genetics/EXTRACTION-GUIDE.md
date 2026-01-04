# Ball Python Genetics Data - Manual Extraction Guide

## Ethical Extraction Guidelines ✅

**Source:** World of Ball Pythons (https://www.worldofballpythons.com)
**robots.txt:** Allows crawling (verified 2026-01-04)
**Method:** Manual review and factual extraction

### Rules
1. ✅ Visit each morph page manually
2. ✅ Read and understand the genetics
3. ✅ Extract FACTUAL data only
4. ✅ Summarize health issues in YOUR OWN WORDS
5. ✅ Include source URL and timestamp
6. ❌ NO verbatim copying of descriptions
7. ❌ NO image downloads
8. ❌ NO automated scraping without review

---

## Extraction Checklist (50 morphs target)

### Co-Dominant Morphs (20)
- [ ] Banana / Coral Glow
- [ ] Pastel
- [ ] Mojave
- [ ] Lesser / Butter
- [ ] Fire
- [ ] Orange Dream
- [ ] Enchi
- [ ] Pinstripe (incomplete dominant)
- [ ] Cypress
- [ ] Leopard
- [ ] Black Pastel
- [ ] Cinnamon
- [ ] Champagne
- [ ] Spotnose
- [ ] YellowBelly
- [ ] Phantom
- [ ] Vanilla
- [ ] Gravel
- [ ] Bamboo
- [ ] Mahogany

### Dominant Morphs (10)
- [ ] Spider
- [ ] Clown (also recessive - check WOBP)
- [ ] Pinstripe
- [ ] Hidden Gene Woma (HGW)
- [ ] Desert Ghost
- [ ] Calico
- [ ] Genetic Stripe
- [ ] Banded
- [ ] Confusion
- [ ] Puzzle

### Recessive Morphs (20)
- [ ] Albino (T+ Albino)
- [ ] Piebald
- [ ] Axanthic (multiple lines: VPI, TSK, Jolliff)
- [ ] Ghost
- [ ] Clown
- [ ] Desert Ghost (also dominant?)
- [ ] Lavender Albino
- [ ] Toffee
- [ ] Ultramel
- [ ] Candy
- [ ] Blue Eyed Leucistic (BEL complex)
- [ ] Sunset
- [ ] Genetic Stripe (recessive line)
- [ ] Monsoon
- [ ] Russo Leucistic
- [ ] Acid
- [ ] Scaleless
- [ ] Caramel Albino
- [ ] GHI (Gotta Have It)
- [ ] Ringer

---

## Extraction Template

```json
{
  "id": "banana",
  "name": "Banana",
  "aliases": ["Coral Glow"],
  "gene_type": "co-dominant",
  "super_form": "Super Banana",
  "visual_traits": {
    "color": "yellow_lavender",
    "pattern": "reduced_pattern"
  },
  "market_value_usd": {
    "single": 150,
    "super": 400,
    "range": "100-250"
  },
  "rarity": "common",
  "health_risk": "low",
  "health_issues": [
    "Super form males may have fertility issues (not all specimens)"
  ],
  "breeding_notes": "Super form viable but check male fertility",
  "source_url": "https://www.worldofballpythons.com/morphs/banana/",
  "fetched_at": "2026-01-04T19:30:00Z",
  "verified_by": "manual_review"
}
```

---

## Field Definitions

### Required Fields
- **id**: lowercase slug (e.g., "banana", "super-pastel")
- **name**: Display name (e.g., "Banana", "Super Pastel")
- **gene_type**: "dominant" | "co-dominant" | "recessive" | "incomplete-dominant"
- **source_url**: Full URL to WOBP morph page
- **fetched_at**: ISO 8601 timestamp

### Optional Fields
- **aliases**: Array of alternative names (e.g., ["Coral Glow"])
- **super_form**: Name of super form for co-dom morphs
- **visual_traits**: Object describing appearance (our summary)
- **market_value_usd**: Current market prices
- **rarity**: "common" | "uncommon" | "rare" | "very_rare"
- **health_risk**: "none" | "low" | "moderate" | "high"
- **health_issues**: Array of health concerns (summarized)
- **breeding_notes**: Any important breeding considerations

---

## Health Risk Categories

### HIGH (scoring penalty: -40)
- Spider: Neurological wobble affects most specimens
- Hidden Gene Woma (HGW): Neurological issues similar to spider
- Super Champagne: Severe wobble, eye issues

### MODERATE (scoring penalty: -20)
- Champagne: Wobble in some specimens
- Super Cinnamon: Head wobble reported
- Spider combos: Intensified wobble

### LOW (scoring penalty: -5)
- Super Banana: Male fertility concerns (not universal)
- Super Black Pastel: Kinking reported rarely
- Caramel Albino: Eye issues in some lines

### NONE (scoring penalty: 0)
- Most common morphs: Pastel, Mojave, Lesser, Piebald, Albino, etc.

---

## Lethal Combinations

**Format:**
```json
{
  "morph1": "Lesser",
  "morph2": "Lesser",
  "result": "Super Lesser (Blue Eyed Leucistic)",
  "lethality": "fatal_some_combos",
  "notes": "Lesser + Butter = lethal, Lesser + Mojave = viable BEL",
  "source_url": "https://www.worldofballpythons.com/morphs/lesser/",
  "fetched_at": "2026-01-04T19:30:00Z"
}
```

**Known Lethal Combos:**
- Lesser x Butter = Lethal
- Lesser x Lesser = Viable (Super Lesser/BEL)
- Mojave x Lesser = Viable (Mojave BEL)
- Champagne x Hidden Gene Woma = Avoid (health issues)

---

## Extraction Workflow

1. **Visit WOBP morph list**: https://www.worldofballpythons.com/morphs/
2. **Pick morph** from checklist above
3. **Read page thoroughly** (don't just skim)
4. **Extract factual data**:
   - Gene type (stated on page)
   - Visual traits (describe in your words)
   - Health issues (summarize, don't copy)
   - Market value (check MorphMarket for current prices)
5. **Add to morphs.json** following template
6. **Wait 2-3 seconds** before next morph (be respectful)
7. **Verify JSON syntax**: `node -c data/genetics/morphs.json`
8. **Git commit** after every 5-10 morphs

---

## Verification Process

After extraction:
1. Compare with MorphMarket calculator (prices, gene types)
2. Cross-reference health issues with multiple sources
3. Validate JSON structure
4. Test in breeding calculator debug page
5. Document any discrepancies in `.smri/logs/`

---

**Target:** 50 morphs minimum
**Time estimate:** 2-3 hours (manual, careful extraction)
**Status:** Ready to begin

