# Business Folder - Documentation Index

**Purpose:** Centralized business rules, requirements, and strategy documents for Serpent Town.

---

## 📄 Files in This Folder

### 1. **BUSINESS_RULES_CONSOLIDATED.md** ⭐ PRIMARY REFERENCE
**Status:** Authoritative  
**Version:** 0.3.0  
**Last Updated:** 2025-12-22

Complete consolidation of ALL business rules from:
- Business requirements
- Module documentation
- Design documents
- README files
- Changelogs
- Setup guides

**Contents:**
- Product catalog rules (display, data sources, validation)
- Purchase & payment flow (Stripe integration, webhooks)
- Ownership & status tracking (KV storage, API endpoints)
- Game economy (currency, loyalty, pricing)
- Snake care rules (stats, decay, actions, health)
- Breeding rules (genetics, requirements, offspring)
- Data storage architecture (KV namespaces, localStorage)
- API contracts (endpoints, validation, CORS)
- Feature flags (enabled/disabled features)
- Validation logic (products, users, stats)
- Security rules (auth, payment, privacy)

**Use this document when:**
- Implementing new features
- Validating business logic
- Debugging data flow issues
- Understanding system constraints
- Onboarding new developers

---

### 2. **BUSINESS_REQUIREMENTS.md** 
**Status:** Active (Original requirements doc)  
**Version:** 0.3.0  
**Last Updated:** 2025-12-22

Original business requirements document covering:
- Shop display rules
- Product data sources
- User ownership tracking
- Payment & purchase flow
- KV storage architecture
- Deployment rules
- Feature flags
- Known limitations

**Relationship to consolidated doc:**
- This is the source document for many rules
- Consolidated doc expands on these with additional sources
- Keep this for historical context

---

### 3. **stripe-kv-sync-strategy.md**
**Status:** Design Document  
**Version:** 0.3.0  
**Last Updated:** 2025-12-22

Technical strategy for syncing Stripe products to KV storage:
- Webhook-based sync (recommended)
- Cron-based sync (alternative)
- Hybrid approach (best practice)
- Implementation plan
- Event handling matrix
- Security considerations
- Monitoring & alerts

**Use this document when:**
- Implementing product sync
- Debugging webhook issues
- Setting up Stripe webhooks
- Understanding sync architecture

---

## 📊 Document Priority

**When implementing features:**
1. **Check:** BUSINESS_RULES_CONSOLIDATED.md (authoritative)
2. **Reference:** Module docs (implementation details)
3. **Context:** BUSINESS_REQUIREMENTS.md (original requirements)
4. **Technical:** stripe-kv-sync-strategy.md (sync implementation)

**When resolving conflicts:**
- BUSINESS_RULES_CONSOLIDATED.md is the source of truth
- If discrepancy found, update consolidated doc and note in changelog

---

## 🔄 Update Policy

**When to update these docs:**
- New feature added → Update consolidated rules
- Business logic changed → Update all relevant docs
- Bug fix with rule implication → Document the clarification
- Feature flag toggled → Update feature flags section

**How to update:**
1. Update BUSINESS_RULES_CONSOLIDATED.md first
2. Update specific docs (BUSINESS_REQUIREMENTS.md, etc.)
3. Update module docs if implementation changed
4. Add entry to CHANGES_SUMMARY.md

---

## 🎯 Quick Reference

### Product Rules
→ BUSINESS_RULES_CONSOLIDATED.md § Product Catalog Rules

### Payment Flow
→ BUSINESS_RULES_CONSOLIDATED.md § Purchase & Payment Rules

### Ownership Tracking
→ BUSINESS_RULES_CONSOLIDATED.md § Ownership & Status Rules

### Game Economy
→ BUSINESS_RULES_CONSOLIDATED.md § Game Economy Rules

### Data Storage
→ BUSINESS_RULES_CONSOLIDATED.md § Data Storage Rules

### API Contracts
→ BUSINESS_RULES_CONSOLIDATED.md § API & Integration Rules

### Feature Flags
→ BUSINESS_RULES_CONSOLIDATED.md § Feature Flags

---

## 🔗 Related Documentation

- **Module Docs:** [../modules/](../modules/) - Implementation details
- **API Docs:** [../api/](../api/) - API reference
- **Architecture:** [../architecture/](../architecture/) - System design
- **Setup Guides:** [../guides/](../guides/) - Installation & deployment

---

**Maintained by:** Development Team  
**Last Updated:** 2025-12-22  
**Version:** 0.3.0
