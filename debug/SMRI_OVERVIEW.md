# SMRI Scenario Overview

**App Version:** 0.5.0  
**Last Updated:** 2025-12-23

All SMRI scenarios and their implementation status in debug modules.

---

## 📊 Module Mapping

### Internal Modules (1-6)
1. **Shop** - Product catalog, Stripe links → `S1.x`
2. **Game** - Tamagotchi mechanics → `S2.x`
3. **Auth** - Hash identity → `S3.x`
4. **Payment** - Stripe integration → `S4.x`
5. **Worker** - API & KV operations → `S5.x`
6. **Common** - Utilities → `S6.x`

### External Services (11+)
- **11.x Cloudflare** (11.1=KV, 11.2=Workers, 11.3=CDN)
- **12.x Stripe** (12.1=Checkout, 12.2=Webhooks, 12.3=API)
- **13.x GitHub** (13.1=Pages, 13.2=Actions)

---

## 🎯 Priority 0 Scenarios (Must Work)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S1.2345.01 | Happy Path - Purchase to Game | - | ⏳ Needs Module |
| S3.5.01 | Hash Validation Security | Auth v0.1 | 🔜 Planned |
| S4.5.02 | Webhook Ownership Security | Payment v0.1 | 🔜 Planned |
| S3.5.03 | Hash Storage Security | Auth v0.1 | 🔜 Planned |
| S5.11.1.01 | KV Data Integrity | Cloudflare v0.1 | 🔜 Planned |

---

## 🎮 Priority 1 Scenarios (Core Gameplay)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S2.0.01 | Load & Display Snake | Game v0.1 | 🔜 Planned |
| S2.0.02 | Feed Snake Action | Game v0.1 | 🔜 Planned |
| S2.0.03 | Water Snake Action | Game v0.1 | 🔜 Planned |
| S2.0.04 | Clean Enclosure | Game v0.1 | 🔜 Planned |
| S2.0.05 | Snake Stats Display | Game v0.1 | 🔜 Planned |

---

## 🛠️ System Health (S6.x)

| SMRI | Description | Debug Module | Version | Status |
|------|-------------|--------------|---------|--------|
| **S6.0.03** | **API Health Check** | **Health Check** | **v1.2** | **✅ READY** |

**Implemented Tests (10):**
1. Worker URL valid
2. Worker online
3. Products API returns data
4. Products have required fields
5. CORS headers present
6. User products endpoint
7. Response time < 5000ms
8. JSON format valid
9. Stripe products exist
10. Stripe checkout links valid

**Access:**
- Browser: `/debug/healthcheck.html`
- CLI: `npm run smri`

---

## 📦 Shop Module (S1.x)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S1.0.01 | Display Catalog | Catalog v0.1 | 🔜 Planned |
| S1.0.02 | Filter by Species | Catalog v0.1 | 🔜 Planned |
| S1.0.03 | Show Product Details | Catalog v0.1 | 🔜 Planned |
| S1.2.01 | Link to Game | Shop-Game v0.1 | 🔜 Planned |

---

## 💳 Stripe Integration (S12.x)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S12.1.01 | Create Checkout Session | Stripe v0.1 | 🔜 Planned |
| S12.2.01 | Webhook Delivery | Stripe v0.1 | 🔜 Planned |
| S12.3.01 | Get Products from API | Stripe v0.1 | 🔜 Planned |

---

## ☁️ Cloudflare KV (S11.1.x)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S11.1.01 | List Products | Cloudflare v0.1 | 🔜 Planned |
| S11.1.02 | Get User Products | Cloudflare v0.1 | 🔜 Planned |
| S11.1.03 | Write Purchase | Cloudflare v0.1 | 🔜 Planned |
| S11.1.04 | Delete Test Data | Cloudflare v0.1 | 🔜 Planned |

---

## 🔐 Auth & Identity (S3.x)

| SMRI | Description | Debug Module | Status |
|------|-------------|--------------|--------|
| S3.0.01 | Generate Hash | Auth v0.1 | 🔜 Planned |
| S3.0.02 | Store Hash | Auth v0.1 | 🔜 Planned |
| S3.0.03 | Retrieve User | Auth v0.1 | 🔜 Planned |
| S3.5.01 | Hash Validation (P0) | Auth v0.1 | 🔜 Planned |

---

## 📈 Implementation Status

**Total SMRI Scenarios:** 45+ documented  
**Implemented in Debug:** 1 (S6.0.03)  
**Progress:** 2% (1/45)

**Ready Modules:**
- ✅ Health Check v1.2 (S6.0.03)

**Planned Modules (0.1):**
- 🔜 Stripe Operations (S12.x)
- 🔜 Cloudflare KV (S11.1.x)
- 🔜 Catalog Tests (S1.x)
- 🔜 Game Tests (S2.x)
- 🔜 Auth Tests (S3.x)

---

## 🎯 Next Steps

**Priority Order:**
1. **S3.5.01** - Hash Validation (P0 Security)
2. **S12.2.01** - Webhook Tests (P0 Revenue)
3. **S11.1.01** - KV Product List (Core Infrastructure)
4. **S1.0.01** - Catalog Display (User-facing)
5. **S2.0.01** - Load Snake (Gameplay)

---

**Document:** Full scenarios in `docs/test/E2E_TEST_SCENARIOS.md`  
**Version Tracking:** `debug/VERSIONS.md`
