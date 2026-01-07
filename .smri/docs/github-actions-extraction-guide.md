# 🤖 GitHub Actions Extraction Guide

**Status:** ✅ Ready to use  
**File:** `.github/workflows/extract-wobp-morphs.yml`

---

## 🚀 How to Run

### 1. Commit & Push This Workflow

```bash
cd /root/catalog
git add .github/workflows/extract-wobp-morphs.yml
git commit -m "ci: add GitHub Actions workflow for WOBP extraction"
git push
```

### 2. Go to GitHub Repository

**URL:** https://github.com/vinas8/catalog

### 3. Navigate to Actions Tab

Click: **Actions** (top navigation bar)

### 4. Select Workflow

Click: **🐍 Extract WOBP Morphs Data** (left sidebar)

### 5. Run Workflow

1. Click: **"Run workflow"** button (right side)
2. Choose mode:
   - **test** - Extract 10 morphs (30 seconds) ← Try this first!
   - **full** - Extract all 400+ morphs (10-15 hours)
3. Click: **"Run workflow"** (green button)

### 6. Monitor Progress

- Workflow will appear in the list
- Click on it to see live logs
- Wait for completion (10-15 hours for full mode)

### 7. Download Results

**Option A: Automatic Commit** (if full mode succeeded)
- Results are automatically committed to your repo
- Pull changes: `git pull`
- Files will be in `data/genetics/`

**Option B: Download Artifacts**
- Click on completed workflow run
- Scroll to "Artifacts" section
- Download:
  - `wobp-morphs-complete-XXX` (cleaned data)
  - `wobp-morphs-raw-XXX` (raw extraction)

---

## 📊 What Gets Created

### Files Committed (if successful):
```
data/genetics/
├── morphs-scraped-raw.json     (400+ morphs, raw)
├── morphs-complete.json        (400+ morphs, cleaned)
└── scraper-checkpoint.json     (resume capability)
```

### Artifacts Available:
- **wobp-morphs-raw-XXX** - Raw scraped data
- **wobp-morphs-complete-XXX** - Production-ready data

---

## 🎯 Expected Timeline

### Test Mode (10 morphs):
- ⏱️ Duration: ~30 seconds
- 💰 Cost: Free (GitHub Actions)
- 🎯 Purpose: Verify scraper works

### Full Mode (400+ morphs):
- ⏱️ Duration: 10-15 hours
- 💰 Cost: Free (within GitHub Actions limits)
- 🎯 Purpose: Complete extraction

---

## 🔍 Monitoring

### Live Logs
Click on the running workflow to see:
```
📝 [2026-01-07T08:05:00Z] Fetching morph list from WOBP...
✅ [2026-01-07T08:05:03Z] Found 420 unique morphs
🔄 [2026-01-07T08:05:06Z] Progress: 1/420 (0%)
🔄 [2026-01-07T08:05:09Z] Scraping: Banana
✓ [2026-01-07T08:05:12Z] Scraped: Banana
...
```

### Checkpoints
Saved every 10 morphs - can resume if interrupted

### Final Summary
```
=== WOBP Extraction Complete ===
✅ Final morph count: 415
Files created:
  morphs-scraped-raw.json (2.5 MB)
  morphs-complete.json (1.8 MB)
```

---

## 🐛 Troubleshooting

### Workflow Not Showing Up?
- Wait 30 seconds after push
- Refresh GitHub Actions page
- Check `.github/workflows/` file exists

### Extraction Failed?
- Check logs for errors
- Download checkpoint artifact
- Re-run with resume capability (modify workflow)

### Timeout (16 hours)?
- WOBP might be slow
- Increase `timeout-minutes` in workflow
- Or run in smaller batches

### No Artifacts?
- Workflow might have failed early
- Check step-by-step logs
- Ensure scraper ran successfully

---

## 🔄 Resume Capability

If extraction is interrupted:

1. Download checkpoint artifact
2. Commit to repo: `data/genetics/scraper-checkpoint.json`
3. Modify workflow to use `--resume` flag
4. Re-run workflow

---

## 📝 Next Steps After Completion

1. **Pull changes:**
   ```bash
   git pull
   ```

2. **Review data:**
   ```bash
   cat data/genetics/morphs-complete.json | jq '.morph_count'
   ```

3. **Update calculator:**
   ```bash
   # Update debug/calc/app.js to use morphs-complete.json
   cp data/genetics/morphs-complete.json data/genetics/morphs.json
   ```

4. **Test calculator:**
   ```bash
   # Open http://localhost:8000/debug/calc/
   ```

5. **Deploy:**
   ```bash
   git add data/genetics/morphs.json
   git commit -m "feat: deploy 400+ morphs to production"
   git push
   ```

---

## 💡 Pro Tips

### Test First!
Always run in **test mode** first to verify everything works.

### Monitor Early
Check logs after first 10 minutes to catch issues early.

### Download Checkpoints
Download checkpoint artifacts periodically (every few hours) as backup.

### GitHub Actions Limits
- Free tier: 2,000 minutes/month
- This uses ~15 hours = 900 minutes (45% of monthly quota)
- More than enough for one extraction

---

## 🎉 Success Criteria

✅ Workflow completes without errors  
✅ `morphs-complete.json` has 380-420 morphs  
✅ Files automatically committed to repo  
✅ No rate limit violations (2.5 sec delay respected)  
✅ Health risks and gene types extracted  

---

**Ready to run? Go to:** https://github.com/vinas8/catalog/actions

**Questions?** Check workflow logs in real-time!

---

**Built with ❤️ and 🐍**  
**Estimated completion:** ~15 hours from now
