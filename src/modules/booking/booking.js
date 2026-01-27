/**
 * Grožio Salono Užsakymų Sistema
 * Google Calendar Integration
 */

// Google Calendar API Configuration
const CONFIG = {
    CLIENT_ID: '904838926097-09n22uaudeshvrmc4b5g6p798mu5b4bk.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCYfxy1UFVxFm56PNpNMC115zB6M8wLx-Y',
    CALENDAR_ID: 'primary', // arba konkretaus kalendoriaus ID
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};

let gapiInited = false;
let gisInited = false;
let tokenClient;

/**
 * Užkrauti Google API
 */
function loadGoogleAPI() {
    // Jei jau demo režimas, nereikia krauti
    if (CONFIG.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
        console.log('Demo režimas: Google Calendar API nekonfigūruota');
        return;
    }

    const script1 = document.createElement('script');
    script1.src = 'https://apis.google.com/js/api.js';
    script1.onload = gapiLoaded;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://accounts.google.com/gsi/client';
    script2.onload = gisLoaded;
    document.body.appendChild(script2);
}

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    try {
        await gapi.client.init({
            apiKey: CONFIG.API_KEY,
            discoveryDocs: CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        console.log('Google Calendar API inicializuota');
    } catch (error) {
        console.error('Klaida inicializuojant Google API:', error);
    }
}

function gisLoaded() {
    try {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CONFIG.CLIENT_ID,
            scope: CONFIG.SCOPES,
            callback: '',
        });
        gisInited = true;
        console.log('Google Identity Services inicializuota');
    } catch (error) {
        console.error('Klaida inicializuojant GIS:', error);
    }
}

/**
 * Pridėti įvykį į Google kalendorių
 */
async function addEventToGoogleCalendar(formData) {
    return new Promise((resolve, reject) => {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                reject(resp);
                return;
            }

            try {
                // Sukurti įvykio laiką
                const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
                const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 valanda

                const event = {
                    summary: `${formData.service} - ${formData.name}`,
                    description: `Klientas: ${formData.name}\nTelefonas: ${formData.phone}\nEl. paštas: ${formData.email || 'Nenurodyta'}\nPastabos: ${formData.notes || 'Nėra'}`,
                    start: {
                        dateTime: startDateTime.toISOString(),
                        timeZone: 'Europe/Vilnius',
                    },
                    end: {
                        dateTime: endDateTime.toISOString(),
                        timeZone: 'Europe/Vilnius',
                    },
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 24 * 60 }, // 1 diena prieš
                            { method: 'popup', minutes: 60 }, // 1 valanda prieš
                        ],
                    },
                    colorId: '9', // Mėlyna spalva
                };

                const request = await gapi.client.calendar.events.insert({
                    calendarId: CONFIG.CALENDAR_ID,
                    resource: event,
                });

                console.log('Įvykis sukurtas:', request.result);
                resolve(request.result);
            } catch (error) {
                console.error('Klaida kuriant įvykį:', error);
                reject(error);
            }
        };

        // Prašyti prieigos
        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    });
}

/**
 * Rodyti pranešimą
 */
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    // Automatiškai paslėpti po 5 sekundžių
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

/**
 * Validuoti formos duomenis
 */
function validateForm(formData) {
    if (!formData.name || formData.name.trim().length < 2) {
        showMessage('Prašome įvesti vardą ir pavardę', 'error');
        return false;
    }

    if (!formData.phone || formData.phone.trim().length < 9) {
        showMessage('Prašome įvesti galiojantį telefono numerį', 'error');
        return false;
    }

    if (!formData.service) {
        showMessage('Prašome pasirinkti paslaugą', 'error');
        return false;
    }

    if (!formData.date) {
        showMessage('Prašome pasirinkti datą', 'error');
        return false;
    }

    if (!formData.time) {
        showMessage('Prašome pasirinkti laiką', 'error');
        return false;
    }

    // Patikrinti ar data nėra praeityje
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDate < now) {
        showMessage('Negalima registruotis į praeitį', 'error');
        return false;
    }

    return true;
}

/**
 * Išsaugoti užsakymą lokaliai (backup)
 */
function saveBookingLocally(formData) {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push({
            ...formData,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        console.log('Užsakymas išsaugotas lokaliai');
    } catch (error) {
        console.error('Klaida saugant lokaliai:', error);
    }
}

/**
 * Form submission handler
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const submitBtn = form.querySelector('.submit-btn');

    // Nustatyti minimalią datą (šiandiena)
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Surinkti duomenis
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            notes: document.getElementById('notes').value.trim()
        };

        // Validuoti
        if (!validateForm(formData)) {
            return;
        }

        // Išjungti mygtuką
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Siunčiama...';

        try {
            // Išsaugoti lokaliai kaip backup
            saveBookingLocally(formData);

            // Bandyti išsaugoti į Google Calendar
            if (CONFIG.CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com' && gapiInited && gisInited) {
                await addEventToGoogleCalendar(formData);
                showMessage('✓ Užsakymas priimtas ir laukia patvirtinimo! Susisieksime netrukus.', 'success');
            } else {
                // Demo režimas
                console.log('Užsakymo duomenys:', formData);
                showMessage('✓ Užsakymas priimtas! Netrukus susisieksime. (Demo režimas)', 'success');
            }

            // Išvalyti formą
            form.reset();

        } catch (error) {
            console.error('Klaida:', error);
            showMessage('❌ Įvyko klaida. Bandykite dar kartą arba skambinkite telefonu.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✓ Užsiregistruoti';
        }
    });
}

// Inicializuoti kai DOM užkrautas
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBookingForm();
        loadGoogleAPI();
    });
} else {
    initBookingForm();
    loadGoogleAPI();
}

// Eksportuoti funkcijas (jei reikia)
export { addEventToGoogleCalendar, showMessage, validateForm };
