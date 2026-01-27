# 🎯 Quick Setup Summary

## ✅ What's Already Done

- ✅ Frontend code pushed to GitHub
- ✅ GitHub Pages URL: https://vinas8.github.io/catalog/booking.html
- ✅ Backend code ready in `google-apps-script.js`
- ✅ No user login required - users just fill form!

---

## 🚀 What You Need To Do (5 minutes)

### Step 1: Deploy Google Apps Script

1. Go to: https://script.google.com/
2. Click **"New Project"**
3. Copy ALL code from `src/modules/booking/google-apps-script.js`
4. Paste into Apps Script editor
5. Click **"Deploy"** → **"New deployment"** → **"Web app"**
6. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️
7. Click **"Deploy"** → Authorize → Allow
8. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/...`)

### Step 2: Update Frontend Config

Edit `src/modules/booking/booking.js`:

```javascript
const CONFIG = {
    BACKEND_URL: 'PASTE_YOUR_WEB_APP_URL_HERE',  // ← Paste here!
    USE_BACKEND: true,
    // ...
};
```

### Step 3: Push to GitHub

```bash
cd /root/catalog
git add .
git commit -m "Add backend URL"
git push
```

### Step 4: Test

Wait 2 minutes, then visit:
https://vinas8.github.io/catalog/booking.html

Fill the form → Submit → No Google login popup! ✅

---

## 📖 Full Guides Available

- **Backend Setup (NO LOGIN)**: `BACKEND-NO-LOGIN-SETUP.md` ← Start here
- **Google Calendar Setup (OAuth)**: `GOOGLE-CALENDAR-SETUP.md`
- **Quick Setup**: `QUICK-SETUP.md`
- **Full README**: `README.md`

---

## 🆘 Need Help?

See detailed troubleshooting in `BACKEND-NO-LOGIN-SETUP.md`

**Common issues:**
- "Origin not allowed" → Check ALLOWED_ORIGINS in Apps Script
- Calendar not updated → Check Apps Script Executions log
- 403 error → Re-deploy with "Anyone" access

---

**Ready to deploy? Start with:** `BACKEND-NO-LOGIN-SETUP.md`
