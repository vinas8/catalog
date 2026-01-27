// ============================================
// MINIMAL WORKING BOOKING BACKEND
// Copy this ENTIRE file to Apps Script
// ============================================

const CONFIG = {
  CALENDAR_ID: 'primary',
  ALLOWED_ORIGINS: [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'https://vinas8.github.io'
  ]
};

// ============================================
// POST HANDLER
// ============================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Validate
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      return jsonResponse({ error: 'Missing required fields' });
    }
    
    // Create calendar event
    const calendar = CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
    const startTime = new Date(data.date + 'T' + data.time + ':00');
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    
    const title = `⏳ PENDING: ${data.service} - ${data.name}`;
    const description = `
Klientas: ${data.name}
Telefonas: ${data.phone}
El. paštas: ${data.email || 'Nenurodyta'}
Pastabos: ${data.notes || 'Nėra'}
    `.trim();
    
    const event = calendar.createEvent(title, startTime, endTime, {
      description: description
    });
    
    event.removeAllReminders();
    event.addEmailReminder(10);
    
    return jsonResponse({
      success: true,
      message: 'Užsakymas priimtas!',
      eventId: event.getId()
    });
    
  } catch (error) {
    Logger.log('ERROR: ' + error);
    return jsonResponse({ error: error.toString() });
  }
}

// ============================================
// GET HANDLER - Test endpoint
// ============================================
function doGet(e) {
  return jsonResponse({
    status: 'online',
    message: 'Booking API works!',
    version: '1.0'
  });
}

// ============================================
// OPTIONS HANDLER - CORS
// ============================================
function doOptions(e) {
  return jsonResponse({});
}

// ============================================
// JSON Response Helper
// ============================================
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// TEST FUNCTION
// ============================================
function testBooking() {
  const testEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Test User',
        phone: '+370 600 00000',
        email: 'test@example.com',
        service: 'Test Service',
        date: '2026-01-29',
        time: '15:00',
        notes: 'Test booking',
        origin: 'http://localhost:8000'
      })
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}
