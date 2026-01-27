# Grožio Salono Užsakymų Sistema

Sistema leidžia klientams registruotis į grožio salono procedūras ir automatiškai išsaugo užsakymus Google kalendoriuje.

## Funkcijos

- 📝 Paprasta užsakymų forma lietuvių kalba
- 📅 Automatinė integracija su Google Calendar
- 💾 Lokalus duomenų saugojimas (backup)
- ✅ Formos validacija
- 📱 Responsive dizainas
- 🌟 Integruota į SMRI architektūrą

## Failai

- `booking.html` - Pagrindinis HTML puslapis
- `src/modules/booking/booking.js` - JavaScript logika ir Google Calendar integracija
- `src/modules/booking/README.md` - Ši dokumentacija

## Konfigūracija

### Google Calendar API nustatymas

**🚀 GREITAS STARTAS:**

**Būdas 1 - Interaktyvus scriptas (REKOMENDUOJAMA):**
```bash
cd /root/catalog/src/modules/booking
./setup.sh
```

**Būdas 2 - Detalios instrukcijos:**
Skaitykite: **[GOOGLE-CALENDAR-SETUP.md](./GOOGLE-CALENDAR-SETUP.md)** - Žingsnis po žingsnio guide

**Būdas 3 - Jei jau turite API kredencialus:**
Redaguokite `src/modules/booking/booking.js`:

```javascript
const CONFIG = {
    CLIENT_ID: 'jusu-client-id.apps.googleusercontent.com',
    API_KEY: 'jusu-api-key',
    CALENDAR_ID: 'primary',
    // ...
};
```

### 2. Demo režimas

Sistema veikia "demo" režimu be Google Calendar:
- Formos validacija veikia
- Duomenys išsaugomi `localStorage`
- Rodomas sėkmės pranešimas
- Galima testuoti visą funkcionalumą

## Naudojimas

### Forma

Klientai turi užpildyti:
- **Vardas Pavardė** (privaloma)
- **Telefono numeris** (privaloma)
- **El. paštas** (neprivaloma)
- **Paslauga** (privaloma)
- **Data** (privaloma, ne praeityje)
- **Laikas** (privaloma, 9:00-20:00)
- **Pastabos** (neprivaloma)

### Paslaugos

- ☀️ Soliarumas (15 min)
- ☀️ Soliarumas (30 min)
- 💅 Manikiūras
- 🦶 Pedikiūras
- ✂️ Plaukų kirpimas
- 🎨 Plaukų dažymas
- ✨ Veido procedūros
- 💆 Masažas

## Google Calendar įvykis

Sukuriamas įvykis su:
- **Pavadinimas**: `[Paslauga] - [Vardas]`
- **Aprašymas**: Visi kliento duomenys
- **Trukmė**: 1 valanda
- **Priminimai**: 1 dieną ir 1 valandą prieš
- **Laiko juosta**: Europe/Vilnius

## Lokalus saugojimas

Visi užsakymai taip pat išsaugomi `localStorage` kaip backup:

```javascript
{
  name: "Vardas Pavardė",
  phone: "+370...",
  email: "email@example.lt",
  service: "Soliarumas (15 min)",
  date: "2024-01-27",
  time: "14:00",
  notes: "Pastabos",
  timestamp: "2024-01-27T12:00:00.000Z",
  id: 1706356800000
}
```

## Saugumas

⚠️ **SVARBU**:
- Naudokite tik OAuth 2.0 Client ID (ne Secret!)
- API Key apribokite tik savo domenui
- Nustatykite CORS apribojimus
- Reguliariai peržiūrėkite Google Cloud Console saugumą

## Tinkinimas

### Pridėti paslaugas

`booking.html`:
```html
<option value="Nauja paslauga">🎯 Nauja paslauga</option>
```

### Pakeisti spalvas

`booking.html` `<style>`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #667eea;
```

### Pakeisti darbo laiką

`booking.html`:
```html
<input type="time" id="time" min="08:00" max="22:00">
```

`booking.js` validacijoje:
```javascript
// Pridėti darbo valandų tikrinimą
```

## Troubleshooting

### Google Calendar neveikia

1. ✅ Patikrinkite Client ID ir API Key
2. ✅ Patikrinkite ar įjungta Calendar API
3. ✅ Patikrinkite authorized origins
4. ✅ Atverkite browser console ir žiūrėkite klaidas

### Forma nepateikiama

1. ✅ Atverkite browser console
2. ✅ Patikrinkite ar visi privalomi laukai užpildyti
3. ✅ Patikrinkite ar data ateityje

## Integracija su Navigation

Sistema automatiškai naudoja bendrą `Navigation.js` komponentą iš catalog.

Pridėti nuorodą:
```html
<a href="booking.html">📅 Užsakymai</a>
```

## GitHub Pages

Sistema veikia su GitHub Pages:

1. Push kodą į GitHub
2. Settings → Pages → Enable
3. Pasiekiama: `https://vartotojas.github.io/catalog/booking.html`

## Licencija

MIT License - Naudokite laisvai savo projektams!
