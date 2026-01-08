/**
 * Event Tutorial System
 * Displays educational event cards to users
 */

export class EventSystem {
  constructor(userId) {
    this.userId = userId;
    this.events = [];
  }

  /**
   * Load events for user from worker
   */
  async loadEvents() {
    try {
      const workerUrl = 'https://catalog.navickaszilvinas.workers.dev';
      const response = await fetch(`${workerUrl}/user-events?user=${this.userId}`);
      
      if (response.ok) {
        const data = await response.json();
        this.events = data.events || [];
        console.log(`✅ Loaded ${this.events.length} events`);
      } else {
        console.log('⚠️ No events endpoint available, using sample events');
        this.events = this.getSampleEvents();
      }
    } catch (error) {
      console.warn('Event loading failed, using samples:', error.message);
      this.events = this.getSampleEvents();
    }
    
    return this.events;
  }

  /**
   * Get sample events for demo/testing
   */
  getSampleEvents() {
    return [
      {
        event_id: 'sample_welcome',
        type: 'welcome',
        title: 'Welcome to Serpent Town! 🐍',
        content: `
          <p><strong>Your snake care journey begins!</strong></p>
          <p>This is your farm where you'll care for your snakes. Check in daily to:</p>
          <ul>
            <li>🍖 Feed your snakes</li>
            <li>💧 Provide fresh water</li>
            <li>🧹 Keep enclosures clean</li>
            <li>📊 Monitor their health</li>
          </ul>
          <p><em>Tip: Regular care keeps your snakes happy and healthy!</em></p>
        `,
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];
  }

  /**
   * Get the next pending event to display
   */
  getNextEvent() {
    return this.events.find(e => e.status === 'pending');
  }

  /**
   * Mark an event as read
   */
  async markEventRead(eventId) {
    const event = this.events.find(e => e.event_id === eventId);
    if (event) {
      event.status = 'read';
      
      // Try to update on server
      try {
        const workerUrl = 'https://catalog.navickaszilvinas.workers.dev';
        await fetch(`${workerUrl}/user-events/${eventId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' })
        });
      } catch (error) {
        console.warn('Failed to update event status on server:', error.message);
      }
      
      console.log(`✅ Marked event ${eventId} as read`);
    }
  }

  /**
   * Render an event card
   */
  renderEventCard(event) {
    if (!event) return '';
    
    return `
      <div class="event-card" data-event-id="${event.event_id}">
        <div class="event-header">
          <span class="event-icon">${this.getEventIcon(event.type)}</span>
          <span class="event-title">${event.title}</span>
          <button class="event-close" onclick="window.eventSystem.dismissEvent('${event.event_id}')">×</button>
        </div>
        <div class="event-content">
          ${event.content}
        </div>
        <div class="event-footer">
          <button class="btn btn-primary" onclick="window.eventSystem.markAndDismiss('${event.event_id}')">
            ✓ Got it!
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Get icon for event type
   */
  getEventIcon(type) {
    const icons = {
      welcome: '👋',
      growth: '📏',
      biological: '🧬',
      health: '❤️',
      education: '📚',
      achievement: '🏆',
      default: '🐍'
    };
    return icons[type] || icons.default;
  }

  /**
   * Mark event as read and dismiss the card
   */
  async markAndDismiss(eventId) {
    await this.markEventRead(eventId);
    this.dismissEvent(eventId);
  }

  /**
   * Dismiss event card (hide it)
   */
  dismissEvent(eventId) {
    const card = document.querySelector(`[data-event-id="${eventId}"]`);
    if (card) {
      card.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => card.remove(), TIMEOUTS.EVENT_CARD_FADE);
    }
  }
}

// Export for global access (temporary, for onclick handlers)
if (typeof window !== 'undefined') {
  window.EventSystem = EventSystem;
}

export default EventSystem;
