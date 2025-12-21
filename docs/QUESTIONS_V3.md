# 🔍 CRITICAL QUESTIONS FOR V3 (10 Essential Gaps)

**Based on v2.md analysis and existing codebase review**

---

## ❓ **Q1: Real Snake Fulfillment & Logistics**
**Gap**: v2.md doesn't address physical product operations

How will you handle:
- [ ] A) Shipping live animals (regulations, carriers, insurance)
- [ ] B) Seasonal restrictions (too hot/cold, ban shipping)
- [ ] C) DOA (Dead On Arrival) policy & refunds
- [ ] D) Health certificates & veterinary checks before shipment
- [ ] E) Packaging requirements (heat/cool packs, containers)
- [ ] F) Customer communication (tracking, arrival instructions)
- [ ] G) Local pickup option (reduce shipping risk)

**ANSWER:** ___________

---

## ❓ **Q2: Existing Products.json Integration**
**Gap**: v2.md proposes new data structure, but you already have products.json with 2 snakes

Current structure:
```json
{
  "id": "SB-2024-01",
  "name": "Super Banana",
  "price": 450,
  "info": "Male • 2024",
  "tag": "Banana",
  "status": "for_sale",
  "img": "img/super-banana.jpg",
  "stripe_link": "https://buy.stripe.com/test_..."
}
```

Should we:
- [ ] A) Extend existing structure (add fields: species, genetics, weight, etc.)
- [ ] B) Migrate to new schema (break existing code)
- [ ] C) Support both (legacy + new format)
- [ ] D) Keep simple for MVP, enhance later

**ANSWER:** ___________

---

## ❓ **Q3: Plugin Architecture vs React Rewrite**
**Gap**: Existing codebase uses plugin system (vanilla JS), v2 proposes React + TypeScript

Decision:
- [ ] A) Keep plugin architecture, enhance it (faster MVP, use existing code)
- [ ] B) Full rewrite to React (better long-term, more work upfront)
- [ ] C) Hybrid (React UI + keep core.js logic)
- [ ] D) Gradual migration (start vanilla, migrate components one-by-one)

**ANSWER:** ___________

---

## ❓ **Q4: Real vs Virtual Snake Distinction**
**Gap**: How do players know if a snake is real (purchasable) vs virtual (free/game-only)?

UI Treatment:
- [ ] A) Separate tabs (Real Shop | Virtual Snakes)
- [ ] B) Badge on card ("Real" vs "Virtual")
- [ ] C) Different visual style (real = photo, virtual = illustration)
- [ ] D) Price indicator ($ for real, coins for virtual)
- [ ] E) All mixed, just show payment method

**ANSWER:** ___________

---

## ❓ **Q5: Care Notification Frequency**
**Gap**: v2 says "not basic feeding" but players need reminders

How often can snakes be safely "neglected"?
- [ ] A) 1 day (daily care required, hardcore)
- [ ] B) 3 days (check every few days, balanced)
- [ ] C) 7 days (weekly care, casual-friendly)
- [ ] D) Vacation mode auto-triggers after 48hrs idle
- [ ] E) No time limit (stats pause when offline)

**Realistic snake feeding**:
- Baby snakes: Every 5-7 days
- Adult snakes: Every 7-14 days

**ANSWER:** ___________

---

## ❓ **Q6: Genetics Complexity for MVP**
**Gap**: Full genetics calculator is complex (100+ morphs, co-dominance, line breeding)

Phase 1 MVP should be:
- [ ] A) No breeding (care only)
- [ ] B) Simple breeding (random outcome from parents)
- [ ] C) Basic genetics (1-2 traits, dominant/recessive only)
- [ ] D) Full calculator from day 1 (major dev effort)

**ANSWER:** ___________

---

## ❓ **Q7: Premium vs Free Snake Care**
**Gap**: If someone buys a real $450 snake, do they still pay in-game gold to feed it?

Model:
- [ ] A) Real purchases = free in-game care (reward)
- [ ] B) All snakes cost in-game currency (fair, F2P friendly)
- [ ] C) Real snakes = reduced care costs (50% discount)
- [ ] D) Premium subscription = free care for all

**ANSWER:** ___________

---

## ❓ **Q8: User Authentication Requirement**
**Gap**: v2 says "Phase 1 LocalStorage, Phase 3 accounts" but Stripe webhooks need user identification

For MVP, do we require:
- [ ] A) Email only (no password, magic link)
- [ ] B) Full signup (email + password)
- [ ] C) Social login (Google, Facebook)
- [ ] D) Anonymous + optional upgrade (email later)
- [ ] E) No auth (LocalStorage, manual unlock via code)

**Stripe webhook needs to know**: Who purchased this snake?

**ANSWER:** ___________

---

## ❓ **Q9: Content Ownership & Moderation**
**Gap**: UGC (user collection showcases, chat, forums) needs moderation

Who is responsible:
- [ ] A) You (manual moderation, full-time job)
- [ ] B) AI moderation (ChatGPT API, auto-filter)
- [ ] C) Community moderators (trusted volunteers)
- [ ] D) No UGC in Phase 1 (delay until scale)
- [ ] E) Hybrid (AI + human review)

Budget for moderation tools (e.g., OpenAI Moderation API)?

**ANSWER:** ___________

---

## ❓ **Q10: Partner Farm Vetting Process**
**Gap**: How do you verify partner farms are legitimate (not scammers, not animal abusers)?

Onboarding requirements:
- [ ] A) Business license (legal entity proof)
- [ ] B) USARK membership (reptile breeder association)
- [ ] C) References (testimonials from customers)
- [ ] D) Video call (meet the breeder, see facility)
- [ ] E) Test transaction (buy a snake, verify delivery)
- [ ] F) Probation period (limited listings until proven)
- [ ] G) Insurance requirement (liability coverage)

How many of these are required? Manual review time per farm?

**ANSWER:** ___________

---

## 📊 V2.0 EVALUATION SUMMARY

### ✅ Strengths (What's Already Great)
1. **Comprehensive business model** - Multiple revenue streams, realistic projections
2. **Technical architecture** - Production-ready stack, scalable
3. **Marketing playbook** - Clear go-to-market phases
4. **B2B platform** - Network effects, commission model
5. **Risk analysis** - Identified threats + mitigation
6. **Financial projections** - Year 1-2 revenue/costs

### ⚠️ Gaps (What v2 Needs)
1. **Logistics** - How physical snakes ship (regulations, carriers, DOA policy)
2. **Data migration** - Existing products.json → new schema (backwards compatibility)
3. **Auth strategy** - MVP needs user identification for Stripe webhooks
4. **Care balance** - How often must users engage? (daily vs weekly)
5. **Genetics scope** - Full calculator in MVP = 6+ months dev time
6. **Real vs virtual UX** - How players distinguish snake types
7. **Moderation plan** - UGC requires content moderation (cost, tools)
8. **Farm vetting** - Partner onboarding process (prevent fraud)
9. **In-game economy** - Real buyers pay for virtual care? (feels bad)
10. **Plugin vs React** - Existing code uses plugins, v2 proposes React (migration path?)

### 🔴 Critical Blockers (Must Answer for MVP)
- **Q8 (Auth)**: Stripe webhooks require user identification
- **Q2 (Data)**: Existing products.json structure vs new schema
- **Q3 (Tech)**: Plugin architecture vs React rewrite
- **Q5 (Care)**: Offline grace period (1 day vs 7 days = different games)

### 🟡 Important (Affects Design)
- **Q4 (Real/Virtual)**: UX clarity
- **Q6 (Genetics)**: MVP scope creep risk
- **Q7 (Premium)**: Monetization fairness

### 🟢 Can Defer (Post-MVP)
- **Q1 (Logistics)**: Only matters after first sale
- **Q9 (Moderation)**: Only matters with UGC (Phase 3)
- **Q10 (Vetting)**: Only matters when onboarding partners (Phase 2-3)

---

## 📂 EXISTING CODEBASE ANALYSIS

### What You Already Have ✅
```
/root/catalog/
├── data/products.json (2 snakes: SB-2024-01, SB-2024-02)
├── img/super-banana.jpg (1 image)
├── src/
│   ├── core.js (plugin system, stat decay, actions)
│   ├── constants.js (CARE_STATS, DEFAULTS)
│   ├── plugins/
│   │   ├── shop.js (catalog with 2 entries)
│   │   ├── tamagotchi.js (feed, clean actions)
│   │   └── snakes.js (corn_snake, king_snake entities)
├── index.html (basic UI: catalog, collection, inspector)
└── tests/ (testing infrastructure)
```

### Current State
- ✅ **Plugin architecture** working (data-driven, extensible)
- ✅ **Basic Tamagotchi** (hunger, clean stats + decay)
- ✅ **Shop integration** (Stripe payment links)
- ✅ **Minimal UI** (functional, not pretty)
- ❌ **No backend** (no user accounts, no webhooks)
- ❌ **No persistence** (refresh = lose data, need LocalStorage)
- ❌ **No real snake data** (products.json has test entries)
- ❌ **Limited stats** (only hunger + clean, need temp/humidity/etc)

### Gap Between Existing & v2.0
| Feature | Existing Code | v2.0 Spec | Gap |
|---------|---------------|-----------|-----|
| **Stats** | hunger, clean | +temp, humidity, health, stress, weight, shed | Need 6 more stats |
| **Actions** | feed, clean | +water, adjust temp, mist, handle, vet | Need 5 more actions |
| **Snakes** | 2 demo (corn, king) | 2 real (Super Banana products.json) | Need to merge |
| **UI** | Simple HTML/CSS | Town hub, house, detailed care | Need new layouts |
| **Data** | In-memory only | LocalStorage → Cloud DB | Need save system |
| **Auth** | None | User accounts | Need Supabase/Auth0 |
| **Payments** | Payment links only | Webhooks, auto-unlock | Need backend |
| **Breeding** | None | Full genetics calculator | Major feature |
| **Social** | None | Chat, trading, friends | Major feature |

### Recommendation: **Hybrid Approach**
1. **Keep plugin architecture** (it's good, extensible)
2. **Enhance existing code** (add missing stats/actions)
3. **Add LocalStorage save** (persistence for MVP)
4. **Defer React rewrite** (post-MVP, not critical path)
5. **Focus on core loop** (buy → care → stats change → save)

---

## 🎯 V3.0 GOALS

Based on gaps identified, v3.0 should include:

1. **Logistics & Operations Plan**
   - Shipping carriers, DOA policy, seasonal restrictions
   - Packaging requirements, health certificates
   - Customer communication workflow

2. **Data Migration Strategy**
   - Extend products.json schema (backwards compatible)
   - Bridge existing plugins → new data model
   - LocalStorage save format

3. **Auth Implementation**
   - Email-only magic link (simplest MVP)
   - Stripe Customer ID mapping
   - Webhook user identification

4. **Care Balance Tuning**
   - Offline grace period (3-7 days realistic)
   - Vacation mode trigger (auto after 48hrs)
   - Notification strategy (weekly digest, not daily spam)

5. **MVP Scope Definition**
   - NO breeding in Phase 1 (defer to Phase 2)
   - NO full genetics (defer to Phase 2)
   - YES basic care (all 8 stats)
   - YES shop integration (Stripe + webhook)

6. **Real/Virtual UX Design**
   - Badge system ("Real Snake 🐍" vs "Virtual 🎮")
   - Separate tabs in shop
   - Free virtual starter snake (onboarding)

7. **Moderation Plan**
   - Phase 1: No UGC (no chat, no forums)
   - Phase 3: AI moderation (OpenAI Moderation API)
   - Budget: $50/month for moderation tools

8. **Farm Vetting Checklist**
   - Business license + USARK membership required
   - Video call + references
   - Probation period (10 sales before full access)

9. **Premium Model Refinement**
   - Real snake buyers: FREE in-game care (reward)
   - Virtual snakes: Paid in-game currency (fair for F2P)
   - Premium sub: Auto-feeders + analytics

10. **Tech Stack Decision**
    - **Phase 1 MVP**: Vanilla JS + existing plugins (fast)
    - **Phase 2**: Add React for complex UI (town hub, house)
    - **Phase 3**: Full React migration (when needed)

---

## 📝 NEXT STEPS

1. **Answer 10 questions above** (especially Q2, Q3, Q5, Q8 - critical blockers)
2. **I'll create v3.0** incorporating:
   - Answers to 10 questions
   - Logistics & operations plan
   - Data migration strategy
   - Refined MVP scope
   - Hybrid tech approach (keep plugins)
3. **Then we start building** Phase 1 MVP with existing code

---

**Please answer the 10 questions above, then I'll generate v3.0!**
