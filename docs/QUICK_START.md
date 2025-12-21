# 🚀 Quick Start - Serpent Town v3.4

## 🎮 Play Game

```bash
cd /root/catalog
python3 -m http.server 8000
```

Open: `http://localhost:8000/game.html`

---

## ✨ What's Fixed

✅ Shop button works  
✅ Reset game works  
✅ Catalog filter works  
✅ Stripe links correct  

---

## 🐍 Add New Snake

**Edit:** `data/products.json`

**Add:**
```json
{
  "id": "YOUR-ID",
  "name": "Snake Name",
  "species": "ball_python",
  "morph": "morph",
  "price": 99.99,
  "status": "available",
  "stripe_link": "https://buy.stripe.com/test_YOUR_LINK"
}
```

**Refresh browser** - Done! 🎉

---

## 🔗 Current Stripe Product

**Super Banana Ball Python**  
Link: `test_cNibJ04XLbUsaNQ8uPbjW00`  
Price: $450  
Status: ✅ Active

---

## 📚 Full Docs

- **Complete:** `docs/versions/v3.4-RELEASE-NOTES.md`
- **Products:** `docs/CATALOG-MANAGEMENT.md`
- **Overview:** `README.md`

---

## 🧪 Test Everything

1. Click **Shop** → Should open ✅
2. Click **Catalog** → Filter works ✅
3. Click **Settings** → Reset safe ✅
4. Click **Buy with Stripe** → Opens correctly ✅

---

**Version:** 3.4.0 | **Status:** ✅ Ready
