// Email Service for Serpent Town v0.7.0 - Plain JS

class MailtrapProvider {
  constructor(apiToken) { this.apiToken = apiToken; }
  async sendEmail(params) {
    try {
      const response = await fetch('https://send.api.mailtrap.io/api/send', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: { email: params.from }, to: [{ email: params.to }],
          subject: params.subject, html: params.html, category: 'order_confirmation'
        })
      });
      if (!response.ok) throw new Error(`Mailtrap error: ${response.status}`);
      const result = await response.json();
      return { success: true, messageId: result.message_id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

class EmailService {
  constructor(provider, config) {
    this.provider = provider;
    this.config = config;
  }
  async sendCustomerOrderConfirmation(data) {
    const html = `<html><body><h1>Thank you!</h1><p>Order ${data.orderId}</p><p>Total: €${(data.totalAmount/100).toFixed(2)}</p></body></html>`;
    return this.provider.sendEmail({ to: data.customerEmail, from: this.config.fromEmail, subject: `Order #${data.orderId}`, html });
  }
  async sendAdminOrderNotification(data) {
    const html = `<html><body><h1>New Order</h1><p>${data.orderId}</p><p>Customer: ${data.customerName}</p></body></html>`;
    return this.provider.sendEmail({ to: this.config.adminEmail, from: this.config.fromEmail, subject: `New Order #${data.orderId}`, html });
  }
}

function createEmailService(env) {
  if (!env.MAILTRAP_API_TOKEN) throw new Error('No email provider configured');
  return new EmailService(new MailtrapProvider(env.MAILTRAP_API_TOKEN), {
    fromEmail: env.FROM_EMAIL || 'orders@serpenttown.com',
    shopName: env.SHOP_NAME || 'Serpent Town',
    adminEmail: env.ADMIN_EMAIL || 'admin@serpenttown.com'
  });
}

export { createEmailService };
