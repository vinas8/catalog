/**
 * Grožio Salono Užsakymų Sistema
 * Google Apps Script Backend Integration
 * 
 * NEREIKIA CLIENT_ID IR API_KEY!
 * Naudoja Google Apps Script kaip backend.
 */

// ============================================
// KONFIGŪRACIJA
// ============================================

const CONFIG = {
    // ← ĮKLIJUOKITE SAVO GOOGLE APPS SCRIPT WEB APP URL
    BACKEND_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    
    // Jūsų domenas (CORS)
    ORIGIN: window.location.origin
};

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
 * Siųsti duomenis į Google Apps Script backend
 */
async function sendToBackend(formData) {
    // Patikrinti ar backend URL sukonfigūruotas
    if (CONFIG.BACKEND_URL.includes('YOUR_SCRIPT_ID')) {
        throw new Error('BACKEND_URL nekonfigūruotas. Žiūrėkite BACKEND-SETUP.md');
    }

    const response = await fetch(CONFIG.BACKEND_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script reikalauja no-cors
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...formData,
            origin: CONFIG.ORIGIN
        })
    });

    // no-cors mode negrąžina response, todėl laikome kad sėkminga
    return { success: true };
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

    // Patikrinti ar backend sukonfigūruotas
    if (CONFIG.BACKEND_URL.includes('YOUR_SCRIPT_ID')) {
        const warning = document.createElement('div');
        warning.className = 'message error';
        warning.style.display = 'block';
        warning.innerHTML = `
            ⚠️ <strong>Backend nekonfigūruotas!</strong><br>
            Žiūrėkite: <code>src/modules/booking/BACKEND-SETUP.md</code>
        `;
        form.insertAdjacentElement('beforebegin', warning);
    }

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

            // Siųsti į backend
            await sendToBackend(formData);

            // Sėkmė
            showMessage('✓ Užsakymas sėkmingai užregistruotas! Netrukus susisieksime.', 'success');
            form.reset();

            // Log info
            console.log('Užsakymas išsiųstas:', formData);

        } catch (error) {
            console.error('Klaida:', error);
            
            if (error.message.includes('BACKEND_URL nekonfigūruotas')) {
                showMessage('⚠️ Sistema dar nekonfigūruota. Žiūrėkite BACKEND-SETUP.md', 'error');
            } else {
                showMessage('❌ Įvyko klaida. Bandykite dar kartą arba skambinkite telefonu.', 'error');
            }
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '✓ Užsiregistruoti';
        }
    });
}

// ============================================
// ADMIN FUNKCIJOS (Tik development)
// ============================================

/**
 * Rodyti visus lokalius užsakymus
 */
function showLocalBookings() {
    try {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        console.table(bookings);
        return bookings;
    } catch (error) {
        console.error('Klaida:', error);
        return [];
    }
}

/**
 * Išvalyti lokalius užsakymus
 */
function clearLocalBookings() {
    if (confirm('Ar tikrai norite išvalyti visus lokalius užsakymus?')) {
        localStorage.removeItem('bookings');
        console.log('Lokalūs užsakymai išvalyti');
    }
}

// Padaryti funkcijas prieinamas console
window.showLocalBookings = showLocalBookings;
window.clearLocalBookings = clearLocalBookings;

// ============================================
// INICIALIZACIJA
// ============================================

// Inicializuoti kai DOM užkrautas
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingForm);
} else {
    initBookingForm();
}

// Eksportuoti funkcijas (jei reikia)
export { sendToBackend, showMessage, validateForm, showLocalBookings, clearLocalBookings };
