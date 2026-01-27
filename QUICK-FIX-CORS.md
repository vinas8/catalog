# 🚨 QUICK FIX - CORS Error

## Problem
❌ Įvyko klaida: Failed to fetch

This means the browser is blocking requests due to CORS.

## ✅ Solution: Create BRAND NEW Apps Script

### Step 1: New Project
1. Go to: https://script.google.com/
2. Click **"New Project"**
3. Name it: `Booking API Working`

### Step 2: Copy Clean Code
1. Delete ALL default code
2. Copy from: `src/modules/booking/google-apps-script-MINIMAL.js`
3. Paste into Apps Script
4. Save (Ctrl+S)

### Step 3: Test It
1. Function dropdown: Select `testBooking`
2. Click ▶ **Run**
3. Authorize when asked
4. Check Execution log - should see: `{"success":true,...}`
5. Check calendar - should have test event!

### Step 4: Deploy
1. Click **"Deploy"** → **"New deployment"**
2. Click gear ⚙️ → Select **"Web app"**
3. Settings:
   ```
   Description: Working API
   Execute as: Me
   Who has access: Anyone ⚠️ CRITICAL!
   ```
4. Click **"Deploy"**
5. **Copy the Web App URL**

### Step 5: Update Frontend
Send me the new URL, and I'll update the code!

---

## Why This Works
- ✅ No library dependencies
- ✅ Clean deployment
- ✅ Simple CORS handling
- ✅ Only 80 lines

## Current Issue
Your current deployment has library conflicts causing CORS issues.
Fresh deployment = Clean slate = Works!

