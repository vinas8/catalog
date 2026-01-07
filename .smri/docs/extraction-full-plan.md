# 🚀 Full WOBP Extraction - Action Plan

**Goal:** Extract all 400+ morphs from World of Ball Pythons  
**Status:** Environment limitation requires alternative approach  
**Decision:** Extract ALL data, not just 70

---

## 🔧 Solution Options

### Option A: Run on Your Local Machine ⭐ **FASTEST**

**Requirements:**
- Windows, Mac, or Ubuntu computer
- Node.js installed
- Internet connection

**Steps:**

1. **Clone repo to your computer:**
```bash
git clone https://github.com/vinas8/catalog.git
cd catalog
```

2. **Install dependencies:**
```bash
npm install puppeteer
```

3. **Test with 10 morphs (30 seconds):**
```bash
node scripts/data-extraction/wobp-scraper.js --test
```

4. **Run full extraction (overnight ~10-15 hours):**
```bash
node scripts/data-extraction/wobp-scraper.js
```

5. **Clean the data:**
```bash
node scripts/data-extraction/clean-scraped-data.js
```

6. **Upload back to server:**
```bash
git add data/genetics/morphs-scraped-raw.json
git add data/genetics/morphs-complete.json
git commit -m "feat: 400+ morphs extracted from WOBP"
git push
```

**Time:** 10-15 hours automated (can run overnight)  
**Quality:** Highest (full browser automation)  
**Effort:** Low (just let it run)

---

### Option B: GitHub Actions (Cloud Automation)

Run Puppeteer in GitHub Actions runner (Ubuntu environment).

**Setup:**

1. **Create `.github/workflows/extract-wobp-data.yml`:**

```yaml
name: Extract WOBP Morphs

on:
  workflow_dispatch:  # Manual trigger only

jobs:
  extract:
    runs-on: ubuntu-latest
    timeout-minutes: 900  # 15 hours max
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm install puppeteer
      
      - name: Run scraper (test mode first)
        run: |
          node scripts/data-extraction/wobp-scraper.js --test
      
      - name: Run full extraction
        run: |
          node scripts/data-extraction/wobp-scraper.js
        continue-on-error: true
      
      - name: Clean scraped data
        run: |
          node scripts/data-extraction/clean-scraped-data.js
        if: always()
      
      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: wobp-morphs-data
          path: |
            data/genetics/morphs-scraped-raw.json
            data/genetics/morphs-complete.json
            data/genetics/scraper-checkpoint.json
          retention-days: 30
      
      - name: Commit results
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data/genetics/morphs-*.json
          git commit -m "feat: auto-extracted 400+ morphs from WOBP" || echo "No changes"
          git push
        if: success()
```

2. **Trigger manually:**
   - Go to GitHub repo → Actions tab
   - Select "Extract WOBP Morphs" workflow
   - Click "Run workflow"
   - Wait 10-15 hours
   - Download artifacts or commit is automatic

**Time:** 10-15 hours automated  
**Quality:** High (Ubuntu environment)  
**Effort:** Low (just trigger workflow)  
**Cost:** Free (GitHub Actions free tier)

---

### Option C: Cloud VM (AWS/GCP/DigitalOcean)

Spin up Ubuntu VM temporarily.

**Steps:**

1. **Launch Ubuntu VM:**
   - AWS EC2: t2.micro (free tier)
   - DigitalOcean: $5/month droplet (cancel after)
   - Google Cloud: e2-micro (free tier)

2. **SSH into VM:**
```bash
ssh user@your-vm-ip
```

3. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Clone & run:**
```bash
git clone https://github.com/vinas8/catalog.git
cd catalog
npm install puppeteer
node scripts/data-extraction/wobp-scraper.js --test  # Test
node scripts/data-extraction/wobp-scraper.js         # Full run
node scripts/data-extraction/clean-scraped-data.js
```

5. **Download results:**
```bash
scp user@your-vm-ip:/path/to/catalog/data/genetics/morphs-*.json ./
```

6. **Destroy VM** (stop paying)

**Time:** 10-15 hours + setup (30 min)  
**Quality:** High  
**Cost:** $0-5 (free tier or 1 day rental)

---

### Option D: Manual Chrome DevTools Method

Extract data manually using browser console (no Puppeteer needed).

**Create extraction bookmarklet:**

```javascript
// Save this as a browser bookmark
javascript:(function(){
  const morphs = [];
  document.querySelectorAll('a[href*="/morphs/"]').forEach(a => {
    if (a.href.includes('/morphs/') && !a.href.endsWith('/morphs/')) {
      morphs.push({
        name: a.textContent.trim(),
        url: a.href
      });
    }
  });
  console.log('Found morphs:', morphs.length);
  console.log(JSON.stringify(morphs, null, 2));
  
  // Auto-download as JSON
  const blob = new Blob([JSON.stringify(morphs, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wobp-morphs-list.json';
  a.click();
})();
```

**Steps:**
1. Visit https://www.worldofballpythons.com/morphs/
2. Click bookmarklet → downloads morph list
3. For each morph, manually visit page & extract data
4. Use existing data cleaning script

**Time:** 40-60 hours (very manual)  
**Quality:** Highest (human review)  
**Effort:** Very high

---

## 🎯 **RECOMMENDED: Option A or B**

### **Option A (Local Machine)** if you have:
- ✅ Windows/Mac/Ubuntu computer
- ✅ Stable internet
- ✅ Can leave computer running overnight

### **Option B (GitHub Actions)** if you have:
- ✅ GitHub account (you already do)
- ✅ No local machine available
- ✅ Want automated commit

---

## 📋 **Next Steps - Choose Your Option**

**Tell me which option you want:**

1. **"local"** - I'll give you exact commands for your computer
2. **"github"** - I'll create the GitHub Actions workflow
3. **"cloud"** - I'll give you cloud VM setup guide
4. **"manual"** - I'll create the extraction bookmarklet

**Which do you prefer?** 🚀
