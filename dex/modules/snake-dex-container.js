// SPDX-FileCopyrightText: 2024-2026 vinas8 (Serpent Town)
// SPDX-License-Identifier: MIT
// Adapted from: PokeRogue pokedex-mon-container.ts (AGPL-3.0)

/**
 * Snake Card Container
 * Based on PokeRogue's PokedexMonContainer
 * Displays individual snake morph in grid
 */

export class SnakeDexContainer {
  constructor(morph, owned = false) {
    this.morph = morph;
    this.owned = owned;
    this.element = this.createCard();
  }

  createCard() {
    const card = document.createElement('div');
    card.className = `snake-card ${this.owned ? 'owned' : ''}`;
    card.dataset.morphId = this.morph.id;

    // Number badge (like Pokedex)
    const number = document.createElement('div');
    number.className = 'snake-number';
    number.textContent = `#${String(this.morph.index || 0).padStart(3, '0')}`;
    card.appendChild(number);

    // Snake icon/sprite
    const icon = document.createElement('div');
    icon.className = 'snake-icon';
    icon.textContent = this.getSnakeEmoji(this.morph.gene_type);
    card.appendChild(icon);

    // Name
    const name = document.createElement('div');
    name.className = 'snake-name';
    name.textContent = this.morph.name;
    card.appendChild(name);

    // Gene type badge
    const geneType = document.createElement('div');
    geneType.className = `gene-badge gene-${this.morph.gene_type.replace('-', '')}`;
    geneType.textContent = this.morph.gene_type.toUpperCase();
    card.appendChild(geneType);

    // Price
    const price = document.createElement('div');
    price.className = 'snake-price';
    price.textContent = `$${this.morph.market_value_usd}`;
    card.appendChild(price);

    // Health risk indicator
    if (this.morph.health_risk !== 'none') {
      const risk = document.createElement('div');
      risk.className = `health-risk risk-${this.morph.health_risk}`;
      risk.textContent = this.morph.health_risk === 'high' ? '⚠️' : '⚡';
      risk.title = this.morph.health_issues.join(', ');
      card.appendChild(risk);
    }

    // Owned checkmark
    if (this.owned) {
      const check = document.createElement('div');
      check.className = 'owned-badge';
      check.textContent = '✓';
      card.appendChild(check);
    }

    // Click handler
    card.addEventListener('click', () => this.onClick());

    return card;
  }

  getSnakeEmoji(geneType) {
    const emojis = {
      'dominant': '🐍',
      'co-dominant': '🟡🐍',
      'recessive': '🔵🐍',
      'super': '⭐🐍'
    };
    return emojis[geneType] || '🐍';
  }

  onClick() {
    // Trigger detail view
    const event = new CustomEvent('snake-selected', {
      detail: { morph: this.morph, owned: this.owned }
    });
    document.dispatchEvent(event);
  }

  update(owned) {
    this.owned = owned;
    if (owned) {
      this.element.classList.add('owned');
      if (!this.element.querySelector('.owned-badge')) {
        const check = document.createElement('div');
        check.className = 'owned-badge';
        check.textContent = '✓';
        this.element.appendChild(check);
      }
    } else {
      this.element.classList.remove('owned');
      const badge = this.element.querySelector('.owned-badge');
      if (badge) badge.remove();
    }
  }

  destroy() {
    this.element.remove();
  }
}
