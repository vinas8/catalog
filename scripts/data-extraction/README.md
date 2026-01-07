# 🗄️ Data Extraction Scripts

Automated tools for extracting ball python genetics data from external sources.

---

## 📁 Files

| Script | Purpose | Status |
|--------|---------|--------|
| `wobp-scraper.js` | Scrapes World of Ball Pythons morphs | ✅ Ready |
| `clean-scraped-data.js` | Cleans and merges scraped data | ✅ Ready |

---

## ⚠️ Environment Note

**This server environment (aarch64 PRoot-Distro) does not support Puppeteer.**

To extract all 400+ morphs, you need to run the scraper on:
- ✅ Local machine (Windows/Mac/Ubuntu)
- ✅ GitHub Actions (cloud Ubuntu runner)
- ✅ Cloud VM (AWS/GCP/DigitalOcean)

See `.smri/docs/extraction-full-plan.md` for detailed options.

---

## 🚀 Quick Start (On Compatible Machine)

### 1. Install Dependencies

```bash
npm install puppeteer
```

### 2. Test Scraper (10 morphs)

```bash
node scripts/data-extraction/wobp-scraper.js --test
```

**Output:** `data/genetics/morphs-scraped-raw.json` (10 morphs)

### 3. Full Extraction (400+ morphs)

```bash
node scripts/data-extraction/wobp-scraper.js
```

**Time:** ~10-15 hours (2.5 sec delay per morph)  
**Output:** `data/genetics/morphs-scraped-raw.json` (400+ morphs)

**Resume if interrupted:**
```bash
node scripts/data-extraction/wobp-scraper.js --resume
```

### 4. Clean & Merge Data

```bash
node scripts/data-extraction/clean-scraped-data.js
```

**Output:** `data/genetics/morphs-complete.json` (production-ready)

### 5. Manual Review

Review the cleaned data:
```bash
cat data/genetics/morphs-complete.json | jq '.morphs[] | select(.health_risk != "none")'
```

Check for:
- Correct gene types
- Accurate health risks
- No false positives in health data
- Reasonable market values

### 6. Deploy to Production

When satisfied:
```bash
cp data/genetics/morphs-complete.json data/genetics/morphs.json
git add data/genetics/morphs.json
git commit -m "feat: update morphs database to 400+ morphs from WOBP"
```

---

## 🔧 Options

### wobp-scraper.js

**`--test`** - Test mode (first 10 morphs only)
```bash
node scripts/data-extraction/wobp-scraper.js --test
```

**`--resume`** - Resume from last checkpoint
```bash
node scripts/data-extraction/wobp-scraper.js --resume
```

---

## 📊 Expected Output

### morphs-scraped-raw.json
```json
{
  "version": "2.0.0-raw",
  "source": "wobp",
  "extraction_method": "puppeteer_automated",
  "scraped_at": "2026-01-06T20:00:00Z",
  "morph_count": 420,
  "requires_manual_review": true,
  "morphs": [
    {
      "id": "banana",
      "name": "Banana",
      "gene_type": "co-dominant",
      "aliases": ["Coral Glow"],
      "description": "Bright yellow with lavender blushing...",
      "health_risks": [
        "Super form males may show reduced fertility."
      ],
      "visual_traits": {},
      "source_url": "https://www.worldofballpythons.com/morphs/banana/",
      "scraped_at": "2026-01-06T20:05:00Z"
    }
  ]
}
```

### morphs-complete.json (after cleaning)
```json
{
  "version": "2.0.0",
  "source": "wobp",
  "extraction_method": "puppeteer_automated_reviewed",
  "morph_count": 415,
  "morphs": [
    {
      "id": "banana",
      "name": "Banana",
      "gene_type": "co-dominant",
      "market_value_usd": 150,
      "health_risk": "low",
      "health_issues": ["Super form males may show reduced fertility"],
      "source_url": "https://www.worldofballpythons.com/morphs/banana/"
    }
  ]
}
```

---

## ⚠️ Ethics & Guidelines

### Rate Limiting
- ✅ 2.5 second delay between requests
- ✅ User-agent identifies bot purpose
- ✅ Respects robots.txt

### Data Usage
- ✅ Educational purpose only
- ✅ Source attribution included
- ✅ Factual extraction (not verbatim)
- ✅ Manual review required

### Checkpointing
- Saves progress every 10 morphs
- Resume if script interrupted
- No duplicate requests

---

## 🐛 Troubleshooting

### "No such file or directory" error
```bash
mkdir -p data/genetics scripts/data-extraction
```

### Puppeteer install issues
```bash
npm install puppeteer --no-sandbox
```

### Timeout errors
Edit `CONFIG.TIMEOUT_MS` in `wobp-scraper.js`:
```javascript
TIMEOUT_MS: 60000 // 60 seconds
```

### Resume not working
Check checkpoint file:
```bash
cat data/genetics/scraper-checkpoint.json
```

---

## 📈 Progress Tracking

Monitor extraction in real-time:
```bash
tail -f data/genetics/scraper-checkpoint.json
```

Check morph count:
```bash
node -e "const d = require('./data/genetics/morphs-scraped-raw.json'); console.log(d.morph_count)"
```

---

## 🔗 Related Documentation

- **Extraction Plan:** `.smri/docs/data-extraction-plan.md`
- **Current Database:** `data/genetics/README.md`
- **MorphMarket Integration:** `.smri/docs/morphmarket-integration.md`

---

**Status:** ✅ Ready to run  
**Estimated time:** 10-15 hours (full extraction)  
**Last updated:** 2026-01-06
