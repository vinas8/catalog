# 🚀 Greitas Startas - Google Calendar Setup

Jei norite greitai pradėti, yra 2 būdai:

## 🎯 Būdas 1: Interaktyvus Scriptas (REKOMENDUOJAMA)

```bash
cd /root/catalog/src/modules/booking
./setup.sh
```

Scriptas:
- ✅ Nuves jus per visus žingsnius
- ✅ Automatiškai įdiegs konfigūracijas
- ✅ Sukurs backup kopiją
- ✅ Paruoš viską testavimui

## 📖 Būdas 2: Rankinis Setup

Skaitykite: **[GOOGLE-CALENDAR-SETUP.md](./GOOGLE-CALENDAR-SETUP.md)**

Detalios instrukcijos su:
- Žingsnis po žingsnio guide
- Screenshots aprašymai
- Troubleshooting
- Saugumo patarimai

---

## ⚡ Labai Greitai (jei jau turite Google API)

1. **Atidarykite:** `src/modules/booking/booking.js`

2. **Raskite:**
```javascript
const CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    API_KEY: 'YOUR_GOOGLE_API_KEY',
    // ...
};
```

3. **Pakeiskite:**
```javascript
const CONFIG = {
    CLIENT_ID: 'jusu-client-id.apps.googleusercontent.com',
    API_KEY: 'jusu-api-key',
    // ...
};
```

4. **Testuokite:**
```bash
cd /root/catalog
python3 -m http.server 8000
```

Naršyklėje: http://localhost:8000/booking.html

---

## 🆘 Pagalba

- 📝 **Pilnas guide:** [GOOGLE-CALENDAR-SETUP.md](./GOOGLE-CALENDAR-SETUP.md)
- 🛠 **Interaktyvus setup:** `./setup.sh`
- 📚 **Dokumentacija:** [README.md](./README.md)

**Problemos?** Žiūrėkite "Troubleshooting" sekciją GOOGLE-CALENDAR-SETUP.md
