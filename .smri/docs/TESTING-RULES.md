# Testing Rules for AI Assistants

## CRITICAL: Always Test Before Claiming "Fixed"

### Rule 1: Test in Browser First
**NEVER say "fixed" without:**
1. Testing the actual URL in browser OR
2. Using curl to verify OR  
3. Running automated tests

**Example:**
```bash
# Test if page loads
curl -I http://localhost:8000/debug/tutorial-collection-runner.html

# Test if module loads
curl -s http://localhost:8000/debug/modules/test-runner.js | head -20

# Check for errors in browser console
# (describe what user should see)
```

### Rule 2: Verify Changes Actually Applied
**Before claiming fix:**
1. Check git status
2. Verify file was modified
3. Confirm changes are in working copy
4. Test with curl or browser

```bash
git status
git diff debug/modules/test-runner.js
curl -s http://localhost:8000/debug/modules/test-runner.js | grep "the-fix"
```

### Rule 3: Don't Repeat Failed Approaches
**If a fix didn't work:**
1. Acknowledge it failed
2. Debug WHY it failed (logs, errors, traces)
3. Try a DIFFERENT approach
4. Don't claim "now it's fixed" with same approach

### Rule 4: Read Error Messages Carefully
**When user reports error:**
1. Look at EXACT error message
2. Find WHERE in code it happens (line number if available)
3. Understand WHY it happens
4. Fix the ROOT CAUSE, not symptoms

**Example bad response:**
- User: "Error: Cannot read properties of undefined"
- AI: "Fixed! Added optional chaining" (without testing)

**Example good response:**
- User: "Error: Cannot read properties of undefined"  
- AI: "Let me check the actual error in console..."
- AI: *uses curl or checks code*
- AI: "Found it on line 142, the issue is X, here's the fix"
- AI: *verifies fix with curl*
- AI: "Tested and confirmed working"

### Rule 5: Use Browser DevTools
**Always mention:**
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Look at actual stack traces

### Rule 6: Acknowledge Mistakes
**When wrong:**
1. Say "I was wrong, let me investigate properly"
2. Don't make excuses
3. Test thoroughly before next response
4. Learn from the mistake

## Testing Checklist

Before saying "fixed":
- [ ] Changed the code
- [ ] Committed to git
- [ ] Verified file deployed (curl or ls)
- [ ] Tested in browser OR with curl
- [ ] Checked console for errors
- [ ] Confirmed expected behavior

## Useful Testing Commands

```bash
# Check if server is running
curl -I http://localhost:8000/

# Test specific file
curl -s http://localhost:8000/path/to/file.html | grep "something"

# Check git status
git status
git diff

# Verify file contents
cat /root/catalog/path/to/file.js | grep "function"

# Check for syntax errors
node --check /root/catalog/file.js

# Test module import
node -e "import('./file.js').then(console.log).catch(console.error)"
```

## Red Flags (Don't Do This)

❌ "Fixed! Try refreshing the page"
❌ "Should work now" (without testing)
❌ "The error is resolved" (no verification)
❌ Repeating same fix after it failed
❌ Making changes without understanding root cause

✅ "Let me test this first..."
✅ "Checking with curl..."
✅ "Here's what I see in the logs..."
✅ "Verified working with [evidence]"
✅ "I was wrong, investigating deeper..."

## Remember

**Users are frustrated when:**
- You claim something is fixed but it's not
- You repeat the same failed approach
- You don't test your changes
- You make excuses instead of fixing

**Users are happy when:**
- You test before claiming success
- You acknowledge and fix mistakes quickly
- You provide evidence of working solution
- You learn and adapt
