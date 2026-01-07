// SPDX-FileCopyrightText: 2024-2026 vinas8 (Serpent Town)
// SPDX-License-Identifier: MIT

/**
 * Morph Data Loader
 * Loads and processes genetics/morphs.json data
 */

export class MorphDataLoader {
  constructor() {
    this.morphs = [];
    this.loaded = false;
  }

  async load() {
    try {
      const response = await fetch('../data/genetics/morphs.json');
      const data = await response.json();
      
      this.morphs = data.morphs.map((morph, index) => ({
        ...morph,
        index: index + 1, // Pokedex-style numbering
        emoji: this.getMorphEmoji(morph)
      }));
      
      this.loaded = true;
      console.log(`📚 Loaded ${this.morphs.length} morphs from genetics database`);
      return this.morphs;
    } catch (error) {
      console.error('Failed to load morph data:', error);
      return [];
    }
  }

  getMorphEmoji(morph) {
    // Assign emojis based on characteristics
    if (morph.super_form) return '⭐';
    if (morph.health_risk === 'high') return '⚠️';
    if (morph.gene_type === 'recessive') return '🔵';
    if (morph.gene_type === 'co-dominant') return '🟡';
    return '🐍';
  }

  getMorphById(id) {
    return this.morphs.find(m => m.id === id);
  }

  getMorphsByGeneType(geneType) {
    return this.morphs.filter(m => m.gene_type === geneType);
  }

  getMorphsByRarity(rarity) {
    return this.morphs.filter(m => m.rarity === rarity);
  }

  getMorphsByHealthRisk(risk) {
    return this.morphs.filter(m => m.health_risk === risk);
  }

  searchMorphs(query) {
    const q = query.toLowerCase();
    return this.morphs.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.aliases.some(a => a.toLowerCase().includes(q)) ||
      m.gene_type.toLowerCase().includes(q)
    );
  }

  getSortedMorphs(sortBy = 'index') {
    const sorted = [...this.morphs];
    
    switch(sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price':
        return sorted.sort((a, b) => b.market_value_usd - a.market_value_usd);
      case 'rarity':
        const rarityOrder = { common: 0, uncommon: 1, rare: 2, legendary: 3 };
        return sorted.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
      case 'index':
      default:
        return sorted.sort((a, b) => a.index - b.index);
    }
  }

  getStats() {
    return {
      total: this.morphs.length,
      dominant: this.morphs.filter(m => m.gene_type === 'dominant').length,
      coDominant: this.morphs.filter(m => m.gene_type === 'co-dominant').length,
      recessive: this.morphs.filter(m => m.gene_type === 'recessive').length,
      highRisk: this.morphs.filter(m => m.health_risk === 'high').length,
      avgPrice: Math.round(this.morphs.reduce((sum, m) => sum + m.market_value_usd, 0) / this.morphs.length)
    };
  }
}
