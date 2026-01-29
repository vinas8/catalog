/**
 * Simple Booking Handler - Email notification instead of Calendar
 * No Google API needed - just sends email with booking details
 */

export async function handleBookingSimple(request, env) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

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
    
    // Validate
    if (!data.name || !data.phone || !data.service || !data.date || !data.time) {
      return new Response(JSON.stringify({ 
        error: 'Trūksta būtinų laukų',
        required: ['name', 'phone', 'service', 'date', 'time']
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Store booking in KV (optional)
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    if (env.BOOKINGS) {
      await env.BOOKINGS.put(bookingId, JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }));
    }

    // Send email notification (if email service configured)
    if (env.NOTIFICATION_EMAIL) {
      await sendBookingEmail(data, env.NOTIFICATION_EMAIL);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Užsakymas priimtas! Susisieksime su Jumis artimiausiu metu.',
      bookingId: bookingId
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

async function sendBookingEmail(data, recipientEmail) {
  const subject = `🆕 Naujas užsakymas: ${data.service} - ${data.name}`;
  const body = `
Naujas užsakymas:

👤 Klientas: ${data.name}
📞 Telefonas: ${data.phone}
📧 El. paštas: ${data.email || 'Nenurodyta'}
🎯 Paslauga: ${data.service}
📅 Data: ${data.date}
🕐 Laikas: ${data.time}
📝 Pastabos: ${data.notes || 'Nėra'}

---
Atsiųsta iš: ${data.origin || 'N/A'}
Laikas: ${new Date().toLocaleString('lt-LT')}
  `.trim();

  // Log to console (will appear in Cloudflare dashboard)
  console.log('New booking:', { subject, body });
  
  // TODO: Integrate with actual email service (Mailgun, SendGrid, etc.)
  // For now, just log it
}
