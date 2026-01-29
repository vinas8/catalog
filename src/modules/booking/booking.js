/**
 * Grožio Salono Užsakymų Sistema
 * Google Calendar Integration
 * Version: 1.1 - Debug Mode
 * Last Updated: 2026-01-27 14:36
 */

// Backend API Configuration
const CONFIG = {
    // Cloudflare Worker backend (no Apps Script needed!)
    BACKEND_URL: 'https://catalog.navickaszilvinas.workers.dev/booking',
    
    // Use backend instead of client OAuth (no user login required)
    USE_BACKEND: true, // Set to false to use client-side OAuth
    DEBUG_MODE: true, // Enable debug logging
    CLIENT_ID: '904838926097-09n22uaudeshvrmc4b5g6p798mu5b4bk.apps.googleusercontent.com',
    API_KEY: 'AIzaSyCYfxy1UFVxFm56PNpNMC115zB6M8wLx-Y',
    CALENDAR_ID: 'primary',
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/calendar.events'
};

// Debug Logger
const DEBUG = {
    log: function(message, data) {
        if (CONFIG.DEBUG_MODE) {
            console.log(`[BOOKING DEBUG] ${message}`, data || '');
            this.addToDebugPanel(message, data);
        }
    },
    error: function(message, error) {
        console.error(`[BOOKING ERROR] ${message}`, error);
        this.addToDebugPanel(`ERROR: ${message}`, error, 'error');
    },
    addToDebugPanel: function(message, data, type = 'info') {
        let panel = document.getElementById('debug-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'debug-panel';
            panel.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:200px;overflow-y:auto;background:#000;color:#0f0;font-family:monospace;font-size:11px;padding:10px;z-index:9999;border-top:2px solid #0f0;';
            document.body.appendChild(panel);
        }
        const time = new Date().toLocaleTimeString();
        const color = type === 'error' ? '#f00' : '#0f0';
        panel.innerHTML += `<div style="color:${color};margin:2px 0">[${time}] ${message} ${data ? JSON.stringify(data).substring(0, 200) : ''}</div>`;
        panel.scrollTop = panel.scrollHeight;
    }
};

DEBUG.log('Booking system loaded', {
    version: '1.1',
    backend: CONFIG.BACKEND_URL,
    useBackend: CONFIG.USE_BACKEND,
    timestamp: new Date().toISOString()
});

let gapiInited = false;
let gisInited = false;
let tokenClient;

/**
 * Užkrauti Google API
 */
function loadGoogleAPI() {
    // Jei naudojame backend, nereikia krauti Google API
    if (CONFIG.USE_BACKEND) {
        console.log('Backend režimas: Google API nekraunama');
        return;
    }
    
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
/**
 * Send booking to backend (no user login required)
 */
async function sendBookingToBackend(formData) {
    DEBUG.log('🚀 Starting backend request', {
        url: CONFIG.BACKEND_URL,
        data: formData
    });
    
    try {
        DEBUG.log('📤 Sending POST request...');
        const response = await fetch(CONFIG.BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                origin: window.location.origin
            }),
            redirect: 'follow' // Handle redirects
        });

        DEBUG.log('📥 Response received', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            type: response.type,
            url: response.url,
            headers: {
                contentType: response.headers.get('content-type')
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            DEBUG.error('❌ Bad response', { status: response.status, body: errorText.substring(0, 500) });
            throw new Error(`Server error: ${response.status}`);
        }

        // Check if response is HTML (redirect page) instead of JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            DEBUG.error('❌ Received HTML instead of JSON - CORS/redirect issue', { contentType });
            throw new Error('Backend neatsakė teisingai. Patikrinkite Apps Script nustatymus.');
        }

        const result = await response.json();
        DEBUG.log('✅ Success!', result);
        
        // Show detailed success info
        if (result.bookingId) {
            DEBUG.log(`📋 Booking ID: ${result.bookingId}`);
        }
        
        return result;
        
    } catch (error) {
        DEBUG.error('💥 Fetch failed', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        // User-friendly error message
        if (error.message === 'Failed to fetch') {
            throw new Error('Nepavyko prisijungti prie serverio. Patikrinkite interneto ryšį.');
        }
        throw error;
    }
}

/**
 * Add event to Google Calendar (client-side OAuth - requires user login)
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
                    summary: `⏳ PENDING: ${formData.service} - ${formData.name}`,
                    description: `⚠️ LAUKIAMA PATVIRTINIMO\n\nKlientas: ${formData.name}\nTelefonas: ${formData.phone}\nEl. paštas: ${formData.email || 'Nenurodyta'}\nPastabos: ${formData.notes || 'Nėra'}\n\n📋 Veiksmai:\n✅ Patvirtinti - Pašalinkite "⏳ PENDING:" iš pavadinimo\n❌ Atmesti - Ištrinkite šį įvykį`,
                    start: {
                        dateTime: startDateTime.toISOString(),
                        timeZone: 'Europe/Vilnius',
                    },
                    end: {
                        dateTime: endDateTime.toISOString(),
                        timeZone: 'Europe/Vilnius',
                    },
                    colorId: '11', // Raudona spalva - "pending" statusui
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: 'email', minutes: 10 }, // Nedelsiant pranešti admin
                            { method: 'popup', minutes: 10 },
                        ],
                    },
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

    if (!formData.duration) {
        showMessage('Prašome pasirinkti trukmę', 'error');
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

    // Patikrinti darbo laiką
    const dayOfWeek = selectedDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    const [hours, minutes] = formData.time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;

    // Sekmadienis (0) - nedirbame
    if (dayOfWeek === 0) {
        showMessage('❌ Sekmadieniais nedirbame. Prašome pasirinkti kitą dieną.', 'error');
        return false;
    }

    // Šeštadienis (6) - 14:00-20:00
    if (dayOfWeek === 6) {
        const startTime = 14 * 60; // 14:00
        const endTime = 20 * 60;   // 20:00
        
        if (timeInMinutes < startTime || timeInMinutes >= endTime) {
            showMessage('⚠️ Šeštadieniais dirbame 14:00-20:00. Prašome pasirinkti laiką šiame intervale.', 'error');
            return false;
        }
    }

    // Darbo dienos (1-5) - 9:00-20:00
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const startTime = 9 * 60;  // 9:00
        const endTime = 20 * 60;   // 20:00
        
        if (timeInMinutes < startTime || timeInMinutes >= endTime) {
            showMessage('⚠️ Darbo dienomis dirbame 9:00-20:00. Prašome pasirinkti laiką šiame intervale.', 'error');
            return false;
        }
    }

    // Patikrinti ar šis laikas jau užimtas
    if (isTimeSlotTaken(formData.date, formData.time)) {
        showMessage('⚠️ Šis laikas jau užimtas. Prašome pasirinkti kitą laiką.', 'error');
        return false;
    }

    return true;
}

/**
 * Check if time slot is already taken
 * Blocks 30-minute intervals regardless of duration
 */
function isTimeSlotTaken(date, time) {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        
        // Parse requested time
        const [hours, minutes] = time.split(':').map(Number);
        const requestedStart = hours * 60 + minutes;
        const requestedEnd = requestedStart + 30; // Always 30-minute slot
        
        // Check if any approved booking conflicts with this 30-minute window
        return bookings.some(booking => {
            if (booking.date !== date || !booking.approvedToCalendar) {
                return false;
            }
            
            const [bookingHours, bookingMinutes] = booking.time.split(':').map(Number);
            const bookingStart = bookingHours * 60 + bookingMinutes;
            const bookingEnd = bookingStart + 30; // Always 30-minute slot
            
            // Check for overlap
            return (requestedStart < bookingEnd && requestedEnd > bookingStart);
        });
    } catch (error) {
        console.error('Error checking time slot:', error);
        return false; // Allow booking if check fails
    }
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
            duration: document.getElementById('duration').value,
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

            DEBUG.log('🎯 Attempting to submit booking...', {
                useBackend: CONFIG.USE_BACKEND,
                backendUrl: CONFIG.BACKEND_URL,
                gapiInited,
                gisInited
            });

            // Check if using backend or client-side OAuth
            if (CONFIG.USE_BACKEND && CONFIG.BACKEND_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
                // Backend approach - NO USER LOGIN REQUIRED
                DEBUG.log('📡 Using backend approach (no login)');
                const result = await sendBookingToBackend(formData);
                DEBUG.log('✅ Backend response:', result);
                showMessage('✓ Užsakymas priimtas! Netrukus susisieksime su Jumis.', 'success');
            } else if (!CONFIG.USE_BACKEND && gapiInited && gisInited) {
                // Client-side OAuth - requires user to login
                DEBUG.log('🔐 Using client OAuth (requires login)');
                await addEventToGoogleCalendar(formData);
                showMessage('✓ Užsakymas priimtas ir laukia patvirtinimo! Susisieksime netrukus.', 'success');
            } else {
                // Demo mode
                DEBUG.log('🎭 Demo mode - no backend configured');
                console.log('Užsakymo duomenys:', formData);
                showMessage('✓ Užsakymas priimtas! (Demo režimas - sukonfigūruokite backend)', 'success');
            }

            // Išvalyti formą
            form.reset();

        } catch (error) {
            console.error('Klaida:', error);
            showMessage('❌ Įvyko klaida: ' + error.message, 'error');
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
        // Only load Google API if not using backend
        if (!CONFIG.USE_BACKEND) {
            loadGoogleAPI();
        }
    });
} else {
    initBookingForm();
    if (!CONFIG.USE_BACKEND) {
        loadGoogleAPI();
    }
}

// Eksportuoti funkcijas (jei reikia)
export { addEventToGoogleCalendar, sendBookingToBackend, showMessage, validateForm };
