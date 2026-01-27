# 🚀 Backend Setup - Vartotojai BE Google Paskyros

## Kas Pasikeitė?

✅ **PRIEŠ:** Vartotojas turėjo prisijungti su Google paskyra (OAuth popup)  
✅ **DABAR:** Vartotojas tiesiog užpildo formą - JOKIO prisijungimo!

## Kaip Veikia?

1. Vartotojas užpildo formą → spauda "Užsiregistruoti"
2. Duomenys išsiunčiami į **Google Apps Script backend**
3. Backend automatiškai prideda į **JŪSŲ kalendorių**
4. Vartotojas gauna patvirtinimą - be jokio Google login!

---

## 📋 Setup Žingsniai

### 1. Atidarykite Google Apps Script

🔗 **Eikite:** https://script.google.com/

### 2. Sukurkite Naują Projektą

1. Spauskite **"New Project"**
2. Pavadinimas: `Booking Backend`

### 3. Įklijuokite Kodą

1. Ištrinkite default `function myFunction()`
2. Atidarykite failą: `src/modules/booking/google-apps-script.js`
3. Nukopijuokite VISĄ kodą
4. Įklijuokite į Apps Script editorių

### 4. Pakeiskite Konfigūraciją

Raskite CONFIG objektą (viršuje):

```javascript
const CONFIG = {
  CALENDAR_ID: 'primary',  // Arba konkretus kalendoriaus ID
  
  ALLOWED_ORIGINS: [
    'http://localhost:8000',
    'https://YOUR-GITHUB-USERNAME.github.io'  // ← PAKEISKITE!
  ],
  
  SEND_CONFIRMATION_EMAIL: false,  // true jei norite siųsti email
  ADMIN_EMAIL: 'admin@example.com' // Jūsų el. paštas
};
```

**Pakeiskite:**
- `YOUR-GITHUB-USERNAME` → `vinas8`
- `ADMIN_EMAIL` → jūsų tikras el. paštas (jei norite gauti pranešimus)

### 5. Išsaugokite Projektą

- Spauskite disketo ikoną arba `Ctrl+S`
- Pavadinimas: `Booking Backend`

### 6. Deploy kaip Web App

1. Viršuje spauskite **"Deploy"** → **"New deployment"**

2. Spauskite prie "Select type" → Pasirinkite **"Web app"**

3. Užpildykite:
   - **Description:** `Booking API v1`
   - **Execute as:** `Me (your@email.com)`
   - **Who has access:** `Anyone` ⚠️ SVARBU!

4. Spauskite **"Deploy"**

5. Suteikite leidimus:
   - Spauskite **"Authorize access"**
   - Pasirinkite savo Google paskyrą
   - Spauskite **"Advanced"** (jei mato warning)
   - Spauskite **"Go to Booking Backend (unsafe)"**
   - Spauskite **"Allow"**

### 7. Nukopijuokite Web App URL

Po deployment matysite:

```
Web app URL: https://script.google.com/macros/s/AKfycbz.../exec
```

**NUKOPIJUOKITE šį URL!** 📋

---

## 8. Įdiekite URL į Frontend

### Būdas 1: Rankiniu būdu

Atidarykite `src/modules/booking/booking.js`:

```javascript
const CONFIG = {
    BACKEND_URL: 'https://script.google.com/macros/s/AKfycbz.../exec', // ← Įklijuokite čia!
    USE_BACKEND: true,
    // ...
};
```

### Būdas 2: Naudojant setup scriptą (greičiau)

```bash
cd /root/catalog/src/modules/booking
./setup.sh
```

Pasirinkite **"Backend (recommended)"** ir įveskite URL.

---

## 9. Testuokite

### Lokaliai:

```bash
cd /root/catalog
python3 -m http.server 8000
```

Naršyklėje: http://localhost:8000/booking.html

### GitHub Pages:

Push į GitHub:
```bash
git add .
git commit -m "Add backend booking system"
git push
```

Testuokite: https://vinas8.github.io/catalog/booking.html

---

## ✅ Patikrinimas

**Testuokite užpildydami formą:**

1. Užpildykite visus laukus
2. Spauskite "Užsiregistruoti"
3. **NETURĖTŲ** atsirasti Google prisijungimo lango
4. Turėtų atsirasti pranešimas: "Užsakymas priimtas!"

**Patikrinkite kalendorių:**
1. Eikite į https://calendar.google.com
2. Turėtumėte matyti naują įvykį su "⏳ PENDING" (jei konfigūruota)

---

## 🔧 Testavimas Apps Script

Prieš deploy, galite testuoti Apps Script:

1. Apps Script editoriuje, spauskite **"Run"** dropdown
2. Pasirinkite `testCreateEvent`
3. Spauskite **"Run"**
4. Patikrinkite Execution log (apačioje)
5. Patikrinkite kalendorių - turėtų būti test įvykis

---

## 🚨 Troubleshooting

### ❌ Klaida: "Origin not allowed"

**Sprendimas:**
1. Apps Script → CONFIG → ALLOWED_ORIGINS
2. Pridėkite tikslų URL (su https://)
3. Deploy → **"Manage deployments"** → **"Edit"** → **"Deploy"**

### ❌ Klaida: "Calendar not found"

**Sprendimas:**
1. Patikrinkite CALENDAR_ID: 'primary' arba konkretus ID
2. Konkretus ID: Google Calendar → Settings → Calendar ID

### ❌ Įvykis neatsiranda kalendoriuje

**Sprendimas:**
1. Apps Script → View → **"Executions"**
2. Žiūrėkite klaidų pranešimus
3. Patikrinkite ar data/laikas teisinga (ne praeityje)

### ❌ "Script function not found: doPost"

**Sprendimas:**
- Įsitikinkite, kad nukopijuotas VISAS kodas iš google-apps-script.js
- Failas turi turėti `function doPost(e) { ... }`

---

## 📊 Pranešimų Konfigūracija

### Email pranešimai (optional)

1. Apps Script → CONFIG:
```javascript
SEND_CONFIRMATION_EMAIL: true,
ADMIN_EMAIL: 'jusu-email@gmail.com'
```

2. Redeploy Web App

**Dabar:**
- Klientas gaus patvirtinimo emailą
- Jūs gausite pranešimą apie naują užsakymą

---

## 🔐 Saugumas

✅ **Gerai:**
- Backend autentifikuojasi su jūsų Google paskyra
- Vartotojai negali tiesiogiai kreiptis į Calendar API
- CORS apsauga per ALLOWED_ORIGINS

⚠️ **Dėmesio:**
- Web App URL yra viešas
- Bet kuris gali siųsti POST requests
- Naudokite rate limiting (jei reikia)

**Papildoma apsauga:**
- Pridėkite CAPTCHA frontend'e
- Patikrinkite IP rate limits Apps Script
- Monitorinkite Executions logus

---

## 📝 Deployment Checklist

- [ ] Apps Script projektas sukurtas
- [ ] Kodas įklijuotas iš google-apps-script.js
- [ ] CONFIG.ALLOWED_ORIGINS pakeistas su tikru domain
- [ ] Web App deployed su "Anyone" access
- [ ] Web App URL nukopijuotas
- [ ] booking.js BACKEND_URL pakeistas
- [ ] USE_BACKEND: true nustatyta
- [ ] Lokaliai testuota
- [ ] GitHub Pages testuota
- [ ] Kalendoriuje matomas įvykis

---

## 🎉 Rezultatas

**Vartotojas:**
- Užpildo formą
- Spauda "Užsiregistruoti"
- Gauna patvirtinimą
- JOKIO Google login!

**Jūs:**
- Gaunate įvykį kalendoriuje
- (Optional) Gaunate email pranešimą
- Galite patvirtinti/atmesti

**Sėkmės! 🚀**
