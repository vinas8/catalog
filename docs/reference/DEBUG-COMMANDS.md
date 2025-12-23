# 🛠️ Debug Commands Reference

**Version:** 0.5.0  
**For:** AI Assistants & Developers

> **Note:** These are project-specific commands, not standard GitHub Copilot CLI features. They appear in search/grep results for discoverability.

---

## 📋 Quick Reference Commands

### `.smri` - System Health & E2E Status

**Keywords:** `.smri`, `smri`, health check, e2e, scenarios, project briefing

**Purpose:** Complete system briefing + health check + E2E scenario status

**When user types `.smri`:**

#### 1. Display Directory Tree
```bash
find /root/catalog -type f -o -type d | grep -v node_modules | grep -v '\.git' | sort
```

#### 2. Version Check
- Show current version from `package.json`
- Display `/root/catalog/README.md`
- Auto-update README if version mismatch

#### 3. SMRI Health Check (S6.0.03)
```bash
# Check server
ps aux | grep "python.*8000"

# Test Worker (if accessible)
curl -s {WORKER_URL}/products | jq 'length'
```

**Report Format:**
```
🏥 SYSTEM HEALTH (S6.0.03)
✅ Server: Running on :8000
✅ Worker: ONLINE (###ms)  
✅ Products: ## from KV
✅ UI: 8 modules verified
✅ Tests: 86/86 passing
```

#### 4. E2E Scenario Status
Parse `docs/test/E2E_TEST_SCENARIOS.md`:
```
📊 SMRI E2E SCENARIOS
Total: 42 scenarios
- P0 (Must-Work): 13 - 100% ✅
- P1 (Gameplay): 9 - 100% ✅  
- P2 (Identity): 5 - 100% ✅
- P3+: 14 - ~50% ⚠️

NEW: S6.0.03 (Health Check) ✅
Implementation: 88% (36/41)
```

#### 5. Quick Access Links
```
🔗 http://localhost:8000/debug.html
🔗 http://localhost:8000/catalog.html
🔗 http://localhost:8000/game.html
```

#### 6. Load Documentation
- Display `docs/v{version}.md` (API reference)
- Display `src/SMRI.md` (quick index)

#### 7. Ask: "📍 Where did we leave off?"

**Purpose:** Holistic view = structure + health + E2E status + business value

---

### `lol` - Code Humor

**Keywords:** `lol`, joke, fun, programming humor, snake jokes

**When user says "lol":** Respond with a random programming/snake joke before continuing with the task.

**Examples:**
- "Why do Python programmers prefer dark mode? Because light attracts bugs! 🐛"
- "What's a snake's favorite programming language? Python, obviously! 🐍"
- "Why do programmers always confuse Halloween and Christmas? Because Oct 31 == Dec 25! 🎃🎄"
- "How do snakes deploy code? They use pip install! 🐍📦"

---

## 📂 File Locations

### SMRI (Serpent Town Main Reference Index)
- **Location:** `/root/catalog/src/SMRI.md`
- **Purpose:** Complete project index with architecture, modules, and guidelines
- **Updates:** Keep version in sync with `package.json`

### Prompt Instructions
- **Location:** `/root/catalog/docs/reference/PROMPT_INSTRUCTIONS.md`
- **Purpose:** Main AI assistant instructions
- **Contains:** Special commands, rules, workflows

---

## 🔍 Related Documentation

- **[COPILOT-RULES.md](COPILOT-RULES.md)** - AI assistant working rules
- **[PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)** - Repository structure
- **[DOC-USAGE-MAP.md](DOC-USAGE-MAP.md)** - Documentation navigation guide

---

**Version:** 0.5.0  
**Last Updated:** 2025-12-23
