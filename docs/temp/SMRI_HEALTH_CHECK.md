# SMRI Health Check System

**Version:** Debug Hub v3.1  
**Status:** ✅ Active (Auto-runs on page load)

---

## 🏥 What Is It?

A **visual health check system** that runs automatically when you open the debug hub. Perfect for **Termux/proot browsers** that don't have F12 DevTools.

---

## 🎯 Location

**Page:** http://localhost:8000/debug.html  
**Module:** 🎯 SMRI Scenarios (first tab, auto-active)  
**Position:** Top card (first thing you see)

---

## ✅ What It Tests

### 1. Worker Status
- Tests if Worker is online
- Measures response time
- Shows latency in ms

### 2. Products API
- Loads products from KV
- Counts how many products exist
- Detects if KV is empty

### 3. UI Components
- Checks for 8 module tabs
- Checks for 8 module content divs
- Verifies dropdown exists
- Verifies switchModule() function

### 4. LocalStorage
- Tests if localStorage works
- Important for game state saving

---

## 🚀 How to Use

### Auto-Run (Default)
1. Open: http://localhost:8000/debug.html
2. Wait 1 second
3. Health check runs automatically
4. See results immediately!

### Manual Run
Click the **"🔍 Run Full Health Check"** button anytime to re-test.

---

## 📊 Results Format

```
📊 Health Check Complete - 14:37:19

✅ Worker is ONLINE (423ms)
✅ Loaded 17 products from KV
✅ Found 8/8 module tabs
✅ Found 8/8 module content divs
✅ switchModule() function exists
✅ Module dropdown exists
✅ LocalStorage is working
```

### Color Coding:
- 🟢 **Green (✅):** Everything OK
- 🟡 **Yellow (⚠️):** Warning (still works but check it)
- 🔴 **Red (❌):** Error (needs fixing)

---

## 🐛 Common Issues & Solutions

### ❌ Worker is OFFLINE
**Solution:** Check if server is running on port 8000
```bash
ps aux | grep "python.*8000"
```

### ⚠️ No products found in KV
**Solution:** Worker is online but KV is empty. Products need to be synced.

### ❌ switchModule() MISSING
**Solution:** JavaScript import failed. Hard refresh the page.

### ⚠️ LocalStorage may be blocked
**Solution:** Browser privacy mode or settings blocking localStorage.

---

## 🔧 For Developers

### Add More Tests

Edit `/root/catalog/src/modules/debug/index.html` and find:

```javascript
window.runHealthCheck = async function() {
  // Add your test here:
  
  try {
    // Test something
    addResult('✅', 'Your test passed', 'ok');
  } catch (e) {
    addResult('❌', 'Your test failed: ' + e.message, 'error');
  }
}
```

### Test Results Helper

```javascript
addResult(emoji, message, status)
// status = 'ok' | 'warn' | 'error'
// emoji = '✅' | '⚠️' | '❌' | etc.
```

---

## 💡 Why This Exists

**Problem:** Termux/proot browsers don't have F12 DevTools  
**Solution:** Built-in visual debugging system that shows ALL info on screen

**Use Cases:**
- Quick system status check
- Verify Worker is deployed
- Test module switching
- Debug catalog loading issues
- Check API connectivity

---

## 🎯 Next Steps

After health check passes:
1. Use **dropdown** to switch modules
2. Test **🧪 API Tests** module
3. Try **📦 Catalog** tests
4. Run **🎯 SMRI Scenarios**

If health check fails:
1. Read the error messages
2. Fix the issue
3. Click "Run Full Health Check" again
4. Repeat until all green ✅

---

**Status:** Production Ready ✅  
**Auto-Run:** Enabled  
**Browser Support:** All (especially Termux)
