// ============================================
// GOOGLE APPS SCRIPT BACKEND
// Grožio Salono Užsakymų Sistema
// ============================================

// ============================================
// KONFIGŪRACIJA
// ============================================

const CONFIG = {
  // Jūsų kalendoriaus ID
  // 'primary' - pagrindinis kalendorius
  // arba konkretus ID (pvz: 'abc123@group.calendar.google.com')
  CALENDAR_ID: 'primary',
  
  // Leistini domenai (CORS apsauga)
  ALLOWED_ORIGINS: [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://YOUR-GITHUB-USERNAME.github.io'  // ← PAKEISKITE!
  ],
  
  // Email pranešimai (optional)
  SEND_CONFIRMATION_EMAIL: false,
  ADMIN_EMAIL: 'admin@example.com'
};

// ============================================
// POST HANDLER - Priima užsakymus
// ============================================

function doPost(e) {
  try {
    // Parse request body
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return createResponse({ error: 'Invalid JSON' }, 400);
    }
    
    // CORS check
    const origin = data.origin || '*';
    if (!isOriginAllowed(origin)) {
      Logger.log('Origin not allowed: ' + origin);
      return createResponse({ error: 'Origin not allowed' }, 403);
    }
    
    // Validacija
    const validation = validateBookingData(data);
    if (!validation.valid) {
      return createResponse({ error: validation.error }, 400);
    }
    
    // Sukurti kalendoriaus įvykį
    const event = createCalendarEvent(data);
    
    // Optional: Siųsti email
    if (CONFIG.SEND_CONFIRMATION_EMAIL && data.email) {
      sendConfirmationEmail(data, event);
    }
    
    // Success response
    return createResponse({
      success: true,
      message: 'Užsakymas sėkmingai užregistruotas!',
      eventId: event.id,
      eventLink: event.htmlLink
    }, 200);
    
  } catch (error) {
    Logger.log('ERROR in doPost: ' + error.toString());
    Logger.log(error.stack);
    return createResponse({
      error: 'Serverio klaida: ' + error.toString()
    }, 500);
  }
}

// ============================================
// OPTIONS HANDLER - CORS preflight
// ============================================

function doOptions(e) {
  return createResponse({}, 200);
}

// ============================================
// GET HANDLER - Testavimui
// ============================================

function doGet(e) {
  return createResponse({
    status: 'online',
    message: 'Grožio Salono API veikia!',
    version: '1.0',
    endpoints: {
      POST: 'Sukurti užsakymą',
      GET: 'Šis endpoint (status check)'
    }
  }, 200);
}

// ============================================
// VALIDACIJA
// ============================================

function validateBookingData(data) {
  // Privalomi laukai
  const required = ['name', 'phone', 'service', 'date', 'time'];
  
  for (const field of required) {
    if (!data[field] || data[field].trim() === '') {
      return {
        valid: false,
        error: `Trūksta privalomo lauko: ${field}`
      };
    }
  }
  
  // Validuoti vardą
  if (data.name.length < 2) {
    return {
      valid: false,
      error: 'Vardas per trumpas'
    };
  }
  
  // Validuoti telefoną
  if (data.phone.length < 9) {
    return {
      valid: false,
      error: 'Telefono numeris per trumpas'
    };
  }
  
  // Validuoti datą
  try {
    const bookingDate = new Date(data.date + 'T' + data.time);
    const now = new Date();
    
    if (bookingDate < now) {
      return {
        valid: false,
        error: 'Negalima registruotis į praeitį'
      };
    }
  } catch (err) {
    return {
      valid: false,
      error: 'Neteisinga data/laikas'
    };
  }
  
  return { valid: true };
}

// ============================================
// KALENDORIAUS ĮVYKIO KŪRIMAS
// ============================================

function createCalendarEvent(data) {
  try {
    const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
    
    if (!calendar) {
      throw new Error('Kalendorius nerastas. Patikrinkite CALENDAR_ID: ' + CONFIG.CALENDAR_ID);
    }
    
    // Sukurti datos objektus
    const startDateTime = new Date(data.date + 'T' + data.time + ':00');
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 valanda
    
    // Įvykio pavadinimas
    const title = `${data.service} - ${data.name}`;
    
    // Aprašymas
    const description = [
      '═══════════════════════════════',
      '    GROŽIO SALONO UŽSAKYMAS',
      '═══════════════════════════════',
      '',
      '👤 Klientas: ' + data.name,
      '📱 Telefonas: ' + data.phone,
      '📧 El. paštas: ' + (data.email || 'Nenurodyta'),
      '🎯 Paslauga: ' + data.service,
      '📅 Data: ' + data.date,
      '⏰ Laikas: ' + data.time,
      '',
      '📝 Pastabos:',
      data.notes || 'Nėra',
      '',
      '═══════════════════════════════',
      'Užsakymas sukurtas: ' + new Date().toLocaleString('lt-LT'),
      '═══════════════════════════════'
    ].join('\n');
    
    // Sukurti įvykį
    const event = calendar.createEvent(title, startDateTime, endDateTime, {
      description: description,
      location: 'Grožio Salonas'
    });
    
    // Pridėti priminimus
    event.removeAllReminders();
    event.addEmailReminder(24 * 60); // 1 diena prieš (minutes)
    event.addPopupReminder(60);       // 1 valanda prieš
    
    // Nustatyti spalvą (optional)
    // 1-11 (skirtingos spalvos)
    try {
      event.setColor(CalendarApp.EventColor.BLUE);
    } catch (e) {
      Logger.log('Nepavyko nustatyti spalvos: ' + e);
    }
    
    Logger.log('✓ Įvykis sukurtas: ' + event.getId());
    Logger.log('  Pavadinimas: ' + title);
    Logger.log('  Laikas: ' + startDateTime.toLocaleString('lt-LT'));
    
    return {
      id: event.getId(),
      title: event.getTitle(),
      startTime: event.getStartTime().toISOString(),
      htmlLink: event.getId() // Full link reikia papildomo API
    };
    
  } catch (error) {
    Logger.log('ERROR kuriant įvykį: ' + error.toString());
    throw new Error('Nepavyko sukurti kalendoriaus įvykio: ' + error.message);
  }
}

// ============================================
// EMAIL PRANEŠIMAS (Optional)
// ============================================

function sendConfirmationEmail(data, event) {
  try {
    const subject = 'Užsakymo patvirtinimas - ' + data.service;
    
    const body = `
Sveiki, ${data.name}!

Jūsų užsakymas sėkmingai užregistruotas.

📋 UŽSAKYMO DETALĖS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Paslauga: ${data.service}
📅 Data: ${data.date}
⏰ Laikas: ${data.time}
📍 Vieta: Grožio Salonas

${data.notes ? '📝 Pastabos: ' + data.notes : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Jei reikia atšaukti ar perkelti vizitą, skambinkite:
📱 +370 XXX XXXXX

Iki pasimatymo!
Grožio Salono Komanda
    `.trim();
    
    // Siųsti klientui
    if (data.email) {
      MailApp.sendEmail(data.email, subject, body);
      Logger.log('Email išsiųstas klientui: ' + data.email);
    }
    
    // Siųsti admin
    if (CONFIG.ADMIN_EMAIL) {
      MailApp.sendEmail(
        CONFIG.ADMIN_EMAIL,
        'Naujas užsakymas: ' + data.service,
        'Naujas užsakymas nuo ' + data.name + '\n\n' + body
      );
      Logger.log('Email išsiųstas admin: ' + CONFIG.ADMIN_EMAIL);
    }
    
  } catch (error) {
    Logger.log('Klaida siunčiant email: ' + error.toString());
    // Nesustabdome proceso dėl email klaidos
  }
}

// ============================================
// HELPER FUNKCIJOS
// ============================================

function isOriginAllowed(origin) {
  // Development: leidžiame localhost
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return true;
  }
  
  return CONFIG.ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.startsWith(allowed)
  );
}

function createResponse(data, statusCode = 200) {
  const output = JSON.stringify(data);
  
  return ContentService
    .createTextOutput(output)
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

// ============================================
// TESTAVIMO FUNKCIJOS
// ============================================

function testCreateEvent() {
  Logger.log('=== TESTAVIMO PRADŽIA ===');
  
  const testData = {
    name: 'Jonas Jonaitis',
    phone: '+370 612 34567',
    email: 'jonas@example.lt',
    service: 'Soliarumas (15 min)',
    date: '2024-02-15',
    time: '14:00',
    notes: 'Testas iš Google Apps Script',
    origin: 'http://localhost:8000'
  };
  
  Logger.log('Test duomenys:');
  Logger.log(JSON.stringify(testData, null, 2));
  
  try {
    // Validuoti
    const validation = validateBookingData(testData);
    Logger.log('Validacija: ' + JSON.stringify(validation));
    
    if (!validation.valid) {
      Logger.log('❌ Validacija nepraėjo: ' + validation.error);
      return;
    }
    
    // Sukurti įvykį
    const event = createCalendarEvent(testData);
    Logger.log('✓ Įvykis sukurtas:');
    Logger.log(JSON.stringify(event, null, 2));
    
    Logger.log('=== TESTAS SĖKMINGAS ===');
    Logger.log('Patikrinkite kalendorių!');
    
    return event;
    
  } catch (error) {
    Logger.log('❌ KLAIDA: ' + error.toString());
    Logger.log(error.stack);
  }
}

function testFullFlow() {
  Logger.log('=== PILNAS FLOW TESTAS ===');
  
  const mockRequest = {
    postData: {
      contents: JSON.stringify({
        name: 'Testas Testauskas',
        phone: '+370 698 12345',
        email: 'test@example.com',
        service: 'Manikiūras',
        date: '2024-02-20',
        time: '15:30',
        notes: 'Full flow testas',
        origin: 'http://localhost:8000'
      })
    }
  };
  
  const response = doPost(mockRequest);
  Logger.log('Response:');
  Logger.log(response.getContent());
}

// ============================================
// ADMIN FUNKCIJOS
// ============================================

function listUpcomingBookings() {
  const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const events = calendar.getEvents(now, weekFromNow);
  
  Logger.log('=== ARTIMIAUSI UŽSAKYMAI ===');
  Logger.log('Rasta: ' + events.length);
  
  events.forEach((event, i) => {
    Logger.log(`\n${i + 1}. ${event.getTitle()}`);
    Logger.log(`   Laikas: ${event.getStartTime().toLocaleString('lt-LT')}`);
    Logger.log(`   ID: ${event.getId()}`);
  });
}
