# Google Calendar API Nustatymas - Žingsnis po Žingsnio

## 📋 Turinys
1. [Google Cloud Projekto Sukūrimas](#1-google-cloud-projekto-sukūrimas)
2. [Calendar API Įjungimas](#2-calendar-api-įjungimas)
3. [OAuth 2.0 Kredencialų Sukūrimas](#3-oauth-20-kredencialų-sukūrimas)
4. [API Key Sukūrimas](#4-api-key-sukūrimas)
5. [Konfigūracijos Įdiegimas](#5-konfigūracijos-įdiegimas)
6. [Testavimas](#6-testavimas)
7. [Problemų Sprendimas](#7-problemų-sprendimas)

---

## 1. Google Cloud Projekto Sukūrimas

### 1.1 Eikite į Google Cloud Console
🔗 **URL:** https://console.cloud.google.com/

### 1.2 Prisijunkite
- Naudokite savo Google paskyrą
- Turi būti ta pati paskyra, kurios kalendorių norite naudoti

### 1.3 Sukurkite naują projektą
1. Viršuje kairėje spauskite ant projekto pavadinimo
2. Spauskite **"NEW PROJECT"** (dešinėje viršuje)
3. Įveskite projekto pavadinimą: `Grozio-Salonas` arba bet kokį kitą
4. Spauskite **"CREATE"**
5. Palaukite kol projektas bus sukurtas (kelios sekundės)

---

## 2. Calendar API Įjungimas

### 2.1 Atverkite API Library
1. Kairėje meniu spauskite ☰ (hamburger menu)
2. **APIs & Services** → **Library**
   
   Arba tiesiog: https://console.cloud.google.com/apis/library

### 2.2 Raskite Calendar API
1. Paieškos lauke įrašykite: `calendar`
2. Spauskite ant **"Google Calendar API"**

### 2.3 Įjunkite API
1. Spauskite mygtuką **"ENABLE"**
2. Palaukite kelias sekundes

✅ **Rezultatas:** Dabar Google Calendar API yra įjungta!

---

## 3. OAuth 2.0 Kredencialų Sukūrimas

### 3.1 Eikite į Credentials
1. Kairėje meniu: **APIs & Services** → **Credentials**
   
   Arba: https://console.cloud.google.com/apis/credentials

### 3.2 Sukonfigūruokite OAuth Consent Screen (PIRMA KARTĄ)
1. Spauskite **"CONFIGURE CONSENT SCREEN"** (jei matote)
2. Pasirinkite **"External"** (jei ne organizacija)
3. Spauskite **"CREATE"**

**Užpildykite formos laukus:**
- **App name:** `Grožio Salono Užsakymai`
- **User support email:** Jūsų el. paštas
- **Developer contact email:** Jūsų el. paštas
- Kitus laukus galite palikti tuščius

4. Spauskite **"SAVE AND CONTINUE"**
5. **Scopes:** Spauskite **"SAVE AND CONTINUE"** (nieko nepridėkite)
6. **Test users:** Spauskite **"ADD USERS"** ir įtraukite savo el. paštą
7. Spauskite **"SAVE AND CONTINUE"**
8. Spauskite **"BACK TO DASHBOARD"**

### 3.3 Sukurkite OAuth 2.0 Client ID
1. Eikite atgal į **Credentials**
2. Viršuje spauskite **"+ CREATE CREDENTIALS"**
3. Pasirinkite **"OAuth client ID"**

**Užpildykite formos laukus:**

4. **Application type:** Pasirinkite **"Web application"**

5. **Name:** `Uzsakymai Web Client`

6. **Authorized JavaScript origins:**
   - Spauskite **"+ ADD URI"**
   - Įrašykite: `http://localhost:8000` (testavimui)
   - Spauskite **"+ ADD URI"** dar kartą
   - Įrašykite: `https://JUSU-VARTOTOJAS.github.io` (production)
   
   **Pavyzdys:**
   ```
   http://localhost:8000
   https://martynas-dev.github.io
   ```

7. **Authorized redirect URIs:**
   - Spauskite **"+ ADD URI"**
   - Įrašykite: `http://localhost:8000/catalog/booking.html`
   - Spauskite **"+ ADD URI"** dar kartą
   - Įrašykite: `https://JUSU-VARTOTOJAS.github.io/catalog/booking.html`

8. Spauskite **"CREATE"**

### 3.4 Nukopijuokite Client ID
- Pasirodys popup langas su kredencialais
- **NUKOPIJUOKITE** `Client ID` (atrodo kaip: `123456-abc.apps.googleusercontent.com`)
- 📋 **Išsaugokite šį ID atskirame faile!**

✅ **Rezultatas:** Turite OAuth 2.0 Client ID!

---

## 4. API Key Sukūrimas

### 4.1 Sukurkite API Key
1. Toje pačioje **Credentials** puslapyje
2. Viršuje spauskite **"+ CREATE CREDENTIALS"**
3. Pasirinkite **"API key"**

### 4.2 Nukopijuokite API Key
- Pasirodys popup su API key
- **NUKOPIJUOKITE** API key (atrodo kaip: `AIzaSyDXXXXXXXXXXXXXXXXXXX`)
- 📋 **Išsaugokite šį key atskirame faile!**

### 4.3 Apribokite API Key (SVARBU!)
1. Popup lange spauskite **"RESTRICT KEY"**
2. **API restrictions:**
   - Pasirinkite **"Restrict key"**
   - Pažymėkite ✅ **"Google Calendar API"**
   
3. **Website restrictions:**
   - Pasirinkite **"HTTP referrers (web sites)"**
   - Spauskite **"ADD AN ITEM"**
   - Įrašykite: `http://localhost:8000/*`
   - Spauskite **"ADD AN ITEM"** dar kartą
   - Įrašykite: `https://JUSU-VARTOTOJAS.github.io/*`

4. Spauskite **"SAVE"**

✅ **Rezultatas:** Turite saugų API Key!

---

## 5. Konfigūracijos Įdiegimas

### 5.1 Atverkite booking.js
```bash
cd /root/catalog/src/modules/booking
nano booking.js
```

### 5.2 Raskite CONFIG objektą (pradžioje failo)
```javascript
const CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    API_KEY: 'YOUR_GOOGLE_API_KEY',
    CALENDAR_ID: 'primary',
    // ...
};
```

### 5.3 Įklijuokite savo kredencialus
```javascript
const CONFIG = {
    CLIENT_ID: '123456-abc.apps.googleusercontent.com', // ← Jūsų Client ID
    API_KEY: 'AIzaSyDXXXXXXXXXXXXXXXXXXX',             // ← Jūsų API Key
    CALENDAR_ID: 'primary',                             // Arba konkretus kalendorius
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};
```

### 5.4 Išsaugokite failą
- **nano:** `Ctrl+X`, tada `Y`, tada `Enter`
- **vim:** `ESC`, tada `:wq`

---

## 6. Testavimas

### 6.1 Paleiskite lokalų serverį
```bash
cd /root/catalog
python3 -m http.server 8000
```

Arba:
```bash
npx http-server -p 8000
```

### 6.2 Atverkite naršyklėje
🔗 http://localhost:8000/booking.html

### 6.3 Užpildykite formą
1. Įveskite visus duomenis
2. Spauskite **"Užsiregistruoti"**

### 6.4 Google prisijungimas
- Pasirodys Google prisijungimo langas
- Pasirinkite savo paskyrą
- Spauskite **"Allow"** (leisti prieigą prie kalendoriaus)

### 6.5 Patikrinkite kalendorių
1. Eikite į https://calendar.google.com
2. Turėtumėte matyti naują įvykį su kliento duomenimis!

✅ **Sėkmė!** Sistema veikia!

---

## 7. Problemų Sprendimas

### ❌ Klaida: "Origin not allowed"
**Sprendimas:**
1. Eikite į Google Cloud Console → Credentials
2. Spauskite ant OAuth Client ID
3. Patikrinkite **Authorized JavaScript origins**
4. Pridėkite tikslų URL (su protokolu: `http://` arba `https://`)
5. Išsaugokite ir palaukite 5 minutes

### ❌ Klaida: "API key not valid"
**Sprendimas:**
1. Patikrinkite ar teisingai nukopijuotas API key
2. Patikrinkite ar API key apribojimuose pažymėta "Google Calendar API"
3. Palaukite 5-10 minučių (Google API cache)

### ❌ Klaida: "Access blocked: This app's request is invalid"
**Sprendimas:**
1. OAuth Consent Screen turi būti užpildytas
2. Pridėkite save kaip "Test user"
3. Patikrinkite ar redirect URIs sutampa

### ❌ Kalendoriuje neatsiranda įvykis
**Sprendimas:**
1. Ativerkite browser console (F12)
2. Žiūrėkite klaidų pranešimus
3. Patikrinkite ar `CALENDAR_ID: 'primary'` arba konkretus kalendoriaus ID

### ❌ Demo pranešimas vis dar rodomas
**Sprendimas:**
1. Patikrinkite ar pakeitėte `CLIENT_ID` į tikrą ID (ne `YOUR_GOOGLE_CLIENT_ID...`)
2. Perkraukite puslapį (Ctrl+F5 - hard refresh)
3. Išvalykite cache

---

## 📝 Papildomi Patarimai

### Naudoti konkretų kalendorių (ne "primary")
1. Eikite į https://calendar.google.com
2. Kairėje, ant kalendoriaus vardo, spauskite **⋮** (3 taškai)
3. **Settings and sharing**
4. Nukopijuokite **"Calendar ID"** (atrodo kaip el. paštas)
5. Įklijuokite į `booking.js`:
   ```javascript
   CALENDAR_ID: 'abc123@group.calendar.google.com'
   ```

### GitHub Pages deployment
1. Push kodą į GitHub
2. Settings → Pages → Enable
3. Atnaujinkite OAuth credentials su tikru GitHub Pages URL
4. Palaukite 5-10 minučių

### Saugumas
⚠️ **NIEKADA** nedėkite **Client Secret** į frontend kodą!
✅ Naudokite tik **Client ID** ir **API Key**
✅ Apribokite API key tik savo domenui
✅ Naudokite OAuth 2.0 flow (ne Service Account)

---

## 🆘 Pagalba

Jei vis tiek neveikia:
1. Browser console (F12) → Console tab
2. Network tab → žiūrėkite failed requests
3. Google Cloud Console → Logs

**Dažniausios klaidos:**
- Neteisingi URL'ai credentials
- Neužpildytas OAuth Consent Screen
- Cache problemos (išvalyti + hard refresh)
- API key restrictions per griežti

---

## ✅ Greitas Checklist

- [ ] Sukurtas Google Cloud projektas
- [ ] Įjungta Google Calendar API
- [ ] Sukonfigūruotas OAuth Consent Screen
- [ ] Sukurtas OAuth 2.0 Client ID
- [ ] Pridėti authorized origins ir redirect URIs
- [ ] Sukurtas API Key
- [ ] API Key apribotas tik Calendar API ir domenui
- [ ] CLIENT_ID įklijuotas į booking.js
- [ ] API_KEY įklijuotas į booking.js
- [ ] Paleistas lokalus serveris
- [ ] Prisijungta per Google
- [ ] Įvykis matomas kalendoriuje

**Sėkmės! 🎉**
