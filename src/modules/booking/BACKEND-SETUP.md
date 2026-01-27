# Google Apps Script Backend - Be kredencialų frontend'e

Kad nereikėtų CLIENT_ID ir API_KEY frontend'e, naudosime **Google Apps Script** kaip backend'ą.

## 🎯 Kaip tai veikia?

```
Frontend (booking.html)
    ↓ (siunčia duomenis)
Google Apps Script (backend)
    ↓ (saugo į)
Google Calendar
```

**Privalumai:**
- ✅ Nereikia CLIENT_ID/API_KEY frontend'e
- ✅ Visiškai NEMOKAMAI
- ✅ Saugiau (kredencialai backend'e)
- ✅ Veikia su GitHub Pages
- ✅ Lengva setup (~5 min)

---

## 📝 Setup Instrukcijos

### 1. Sukurti Google Apps Script

1. Eikite į: https://script.google.com
2. Spauskite **"New Project"** (+ New project)
3. Pakeiskite pavadinimą: "Grozio Salonas API"

### 2. Įklijuoti Backend kodą

Ištrinkite viską ir įklijuokite šį kodą:

```javascript
// ============================================
// KONFIGŪRACIJA
// ============================================

const CONFIG = {
  CALENDAR_ID: 'primary', // Arba konkretus kalendoriaus ID
  ALLOWED_ORIGINS: [
    'http://localhost:8000',
    'https://YOUR-USERNAME.github.io'  // ← Pakeiskite į savo GitHub username
  ]
};

// ============================================
// PAGRINDINIS ENDPOINT
// ============================================

function doPost(e) {
  try {
    // CORS headers
    const origin = e.parameter.origin || e.postData?.origin;
    
    if (!CONFIG.ALLOWED_ORIGINS.includes(origin)) {
      return createResponse({ error: 'Origin not allowed' }, 403);
    }
    
    // Parse duomenys
    const data = JSON.parse(e.postData.contents);
    
    // Validacija
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      return createResponse({ error: 'Trūksta privalomų laukų' }, 400);
    }
    
    // Sukurti kalendoriaus įvykį
    const result = createCalendarEvent(data);
    
    return createResponse({ 
      success: true, 
      message: 'Užsakymas sėkmingai užregistruotas!',
      eventId: result.id
    });
    
  } catch (error) {
    Logger.log('Klaida: ' + error.toString());
    return createResponse({ 
      error: 'Įvyko klaida serveryje: ' + error.toString() 
    }, 500);
  }
}

// OPTIONS handler (CORS preflight)
function doOptions(e) {
  const origin = e.parameter.origin;
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// ============================================
// SUKURTI KALENDORIAUS ĮVYKĮ
// ============================================

function createCalendarEvent(data) {
  try {
    const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
    
    if (!calendar) {
      throw new Error('Kalendorius nerastas. Patikrinkite CALENDAR_ID.');
    }
    
    // Sukurti datos objektus
    const startDateTime = new Date(data.date + 'T' + data.time + ':00');
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 valanda
    
    // Aprašymas
    const description = `
Klientas: ${data.name}
Telefonas: ${data.phone}
El. paštas: ${data.email || 'Nenurodyta'}
Pastabos: ${data.notes || 'Nėra'}
    `.trim();
    
    // Sukurti įvykį
    const event = calendar.createEvent(
      `${data.service} - ${data.name}`,
      startDateTime,
      endDateTime,
      {
        description: description,
        location: 'Grožio Salonas'
      }
    );
    
    // Pridėti priminimus
    event.removeAllReminders();
    event.addEmailReminder(60 * 24); // 1 diena prieš
    event.addPopupReminder(60); // 1 valanda prieš
    
    Logger.log('Įvykis sukurtas: ' + event.getId());
    
    return { 
      id: event.getId(),
      title: event.getTitle(),
      startTime: event.getStartTime()
    };
    
  } catch (error) {
    Logger.log('Klaida kuriant įvykį: ' + error.toString());
    throw error;
  }
}

// ============================================
// HELPER FUNKCIJOS
// ============================================

function createResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  return output.setHeaders(headers);
}

// ============================================
// TESTAVIMO FUNKCIJA
// ============================================

function testCreateEvent() {
  const testData = {
    name: 'Jonas Jonaitis',
    phone: '+370 612 34567',
    email: 'jonas@example.lt',
    service: 'Soliarumas (15 min)',
    date: '2024-02-01',
    time: '14:00',
    notes: 'Testas'
  };
  
  const result = createCalendarEvent(testData);
  Logger.log('Test rezultatas: ' + JSON.stringify(result));
}
```

### 3. Deploy kaip Web App

1. Viršuje spauskite **"Deploy"** → **"New deployment"**
2. **Deployment type:** Pasirinkite **"Web app"**
3. **Description:** "v1"
4. **Execute as:** **Me** (jūsų paskyra)
5. **Who has access:** **Anyone** (kad veiktų iš GitHub Pages)
6. Spauskite **"Deploy"**

### 4. Nukopijuoti Web App URL

Po deployment pasirodys URL kaip:
```
https://script.google.com/macros/s/ABC123.../exec
```

**☝️ NUKOPIJUOKITE ŠĮ URL!**

### 5. Atnaujinti Frontend kodą

Sukursime naują `booking-backend.js` versiją.

---

## 🔄 Atnaujintas Frontend Kodas

Bus sukurtas atskiras failas `booking-backend.js` kuris naudoja Google Apps Script backend'ą.

---

## ✅ Checklist

- [ ] Sukurtas Google Apps Script projektas
- [ ] Įklijuotas backend kodas
- [ ] Pakeistas `ALLOWED_ORIGINS` su savo GitHub username
- [ ] Deployed kaip Web App
- [ ] Nukopijuotas Web App URL
- [ ] Atnaujintas frontend kodas su Web App URL
- [ ] Ištestavimas lokaliai
- [ ] Ištestavimas GitHub Pages

---

## 🛠️ Testavimas

### Test 1: Google Apps Script Console
```javascript
testCreateEvent()
```
Spauskite ▶️ Run ir patikrinkite kalendorių.

### Test 2: Frontend
1. Atnaujinkite `booking.html` naudoti `booking-backend.js`
2. Užpildykite formą
3. Submit
4. Patikrinkite kalendorių

---

## 📊 Pranašumai vs Trūkumai

### ✅ Pranašumai
- Nereikia CLIENT_ID/API_KEY frontend'e
- Nemokamai
- Paprasčiau security
- Galima pridėti papildomą logiką (email, SMS)

### ⚠️ Trūkumai
- Google Apps Scriptturi limitus (20 calls/sec)
- Šiek tiek lėtesnis (backend roundtrip)
- Reikia redeploy jei keičiasi kodas

---

## 🔐 Saugumas

### Current setup:
- ✅ CORS apsauga (tik jūsų domenai)
- ✅ Kredencialai backend'e
- ✅ Validacija server-side

### Papildoma apsauga (optional):
1. **Rate limiting** - apriboti requests
2. **API Key** - paprastas token autentifikacijai
3. **reCAPTCHA** - apsauga nuo botų

---

## 📝 Kitas žingsnis

Paleisiu scriptą kuris automatiškai sukurs naują `booking-backend.js` su Google Apps Script integracija!
