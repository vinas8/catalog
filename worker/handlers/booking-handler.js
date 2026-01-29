/**
 * Booking Handler - Google Calendar Integration
 * No user login required - uses service account
 */

export async function handleBooking(request, env) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      return new Response(JSON.stringify({ 
        error: 'Trūksta būtinų laukų',
        required: ['name', 'phone', 'service', 'date', 'time']
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create event in Google Calendar using service account
    const calendarResult = await createCalendarEvent(data, env);

    return new Response(JSON.stringify({
      success: true,
      message: 'Užsakymas priimtas! Susisieksime su Jumis artimiausiu metu.',
      eventId: calendarResult.eventId
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Booking error:', error);
    return new Response(JSON.stringify({
      error: 'Įvyko klaida. Prašome bandyti dar kartą arba skambinti telefonu.',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Create event in Google Calendar using service account
 */
async function createCalendarEvent(data, env) {
  // Get OAuth token from service account
  const token = await getServiceAccountToken(env);

  // Format event data
  const startDateTime = `${data.date}T${data.time}:00`;
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hour

  const event = {
    summary: `⏳ PENDING: ${data.service} - ${data.name}`,
    description: `
Klientas: ${data.name}
Telefonas: ${data.phone}
El. paštas: ${data.email || 'Nenurodyta'}
Pastabos: ${data.notes || 'Nėra'}
    `.trim(),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'Europe/Vilnius'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'Europe/Vilnius'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 10 }
      ]
    }
  };

  // Create event via Google Calendar API
  const calendarId = env.GOOGLE_CALENDAR_ID || 'primary';
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Calendar API error: ${response.status} - ${error}`);
  }

  const result = await response.json();
  return { eventId: result.id };
}

/**
 * Get OAuth token from Google service account
 */
async function getServiceAccountToken(env) {
  if (!env.GOOGLE_SERVICE_ACCOUNT) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT not configured in environment');
  }

  const serviceAccount = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT);
  
  // Create JWT for service account
  const now = Math.floor(Date.now() / 1000);
  const jwt = await createJWT({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/calendar',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }, serviceAccount.private_key);

  // Exchange JWT for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OAuth token error: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Create JWT token (simplified - you'll need crypto library)
 */
async function createJWT(payload, privateKey) {
  // This is a placeholder - actual implementation needs crypto.subtle
  // For now, throw error with instructions
  throw new Error('JWT signing not yet implemented. See setup instructions.');
}
