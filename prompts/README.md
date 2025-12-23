# AI Prompts for Serpent Town

**Purpose:** SMRI-focused AI prompts for development workflows

**Usage:** Copy prompt content → Paste to ChatGPT/Claude → Get results

---

## 📂 Available Prompts

### SMRI System Prompts
- `smri_scenario_generator.md` - User story → SMRI scenario
- `smri_code_reviewer.md` - Code diff → SMRI compliance
- `smri_fact_extractor.md` - Extract atomic system facts
- `smri_test_generator.md` - Scenario → Test code

---

## 🚀 How to Use

1. **Pick a prompt:**
   ```bash
   cat prompts/smri_scenario_generator.md
   ```

2. **Copy the content**

3. **Use with any AI:**
   - ChatGPT (paste system prompt)
   - Claude (paste as instructions)
   - Local LLM (use as system message)

4. **Provide your input:**
   - Paste your E2E docs
   - Or code diff
   - Or user story

5. **Get results!**

---

## 🔧 Creating Custom Prompts

Template:
```markdown
# IDENTITY
You are a [role] for Serpent Town.

# CONTEXT
- SMRI system with modules 1-6
- Documentation-driven development
- [other context]

# TASK
[specific task]

# OUTPUT FORMAT
[how to format]

# RULES
- Rule 1
- Rule 2
```

Save as: `prompts/your_prompt_name.md`

---

**No API keys needed - just copy/paste to any AI!**
