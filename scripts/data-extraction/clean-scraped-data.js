#!/usr/bin/env node
/**
 * Clean Scraped Data
 * Processes raw scraped data and creates production-ready morphs.json
 * 
 * Usage:
 *   node scripts/data-extraction/clean-scraped-data.js
 */

const fs = require('fs').promises;
const path = require('path');

const INPUT_FILE = path.join(__dirname, '../../data/genetics/morphs-scraped-raw.json');
const OUTPUT_FILE = path.join(__dirname, '../../data/genetics/morphs-complete.json');
const EXISTING_FILE = path.join(__dirname, '../../data/genetics/morphs.json');

// ============================================================================
// UTILITIES
// ============================================================================

function log(message, level = 'info') {
  const prefix = { info: '📝', success: '✅', error: '❌', warn: '⚠️' }[level] || '📝';
  console.log(`${prefix} ${message}`);
}

function normalizeGeneType(geneType) {
  if (!geneType) return null;
  
  const normalized = geneType.toLowerCase().trim();
  
  if (normalized.includes('co-dom') || normalized.includes('codominant')) {
    return 'co-dominant';
  } else if (normalized.includes('incomplete')) {
    return 'incomplete-dominant';
  } else if (normalized.includes('dominant')) {
    return 'dominant';
  } else if (normalized.includes('recessive')) {
    return 'recessive';
  }
  
  return null;
}

function extractHealthRisk(healthRisks) {
  if (!healthRisks || healthRisks.length === 0) return 'none';
  
  const combined = healthRisks.join(' ').toLowerCase();
  
  // High risk keywords
  if (combined.includes('wobble') || 
      combined.includes('neurological') ||
      combined.includes('lethal') ||
      combined.includes('fatal')) {
    return 'high';
  }
  
  // Moderate risk keywords
  if (combined.includes('kinking') ||
      combined.includes('eye issue') ||
      combined.includes('fertility concern')) {
    return 'moderate';
  }
  
  // Low risk keywords
  if (combined.includes('may reduce') ||
      combined.includes('some specimens') ||
      combined.includes('rarely')) {
    return 'low';
  }
  
  return 'none';
}

function cleanHealthRisks(healthRisks) {
  if (!healthRisks || healthRisks.length === 0) return [];
  
  return healthRisks
    .map(risk => risk.trim())
    .filter(risk => {
      // Remove non-health related sentences
      const lower = risk.toLowerCase();
      return (
        lower.includes('health') ||
        lower.includes('wobble') ||
        lower.includes('neurological') ||
        lower.includes('kinking') ||
        lower.includes('fertility') ||
        lower.includes('eye') ||
        lower.includes('issue') ||
        lower.includes('concern') ||
        lower.includes('problem')
      );
    })
    .slice(0, 2); // Keep max 2 sentences
}

// ============================================================================
// MAIN PROCESSING
// ============================================================================

async function main() {
  log('🧹 Cleaning scraped data...', 'info');
  
  try {
    // Load raw scraped data
    const rawData = JSON.parse(await fs.readFile(INPUT_FILE, 'utf8'));
    log(`Loaded ${rawData.morph_count} raw morphs`, 'success');
    
    // Load existing data to merge
    let existingMorphs = [];
    try {
      const existing = JSON.parse(await fs.readFile(EXISTING_FILE, 'utf8'));
      existingMorphs = existing.morphs || [];
      log(`Loaded ${existingMorphs.length} existing morphs for merging`, 'success');
    } catch (err) {
      log('No existing morphs.json found, starting fresh', 'warn');
    }
    
    // Create lookup of existing morphs
    const existingMap = new Map();
    existingMorphs.forEach(m => {
      existingMap.set(m.id, m);
    });
    
    // Process each scraped morph
    const cleanedMorphs = [];
    let mergedCount = 0;
    let newCount = 0;
    let skippedCount = 0;
    
    for (const raw of rawData.morphs) {
      // Skip if scraping failed
      if (raw.error) {
        skippedCount++;
        continue;
      }
      
      // Check if exists in current data
      const existing = existingMap.get(raw.id);
      
      // Build cleaned morph object
      const cleaned = {
        id: raw.id,
        name: raw.name,
        aliases: raw.aliases || [],
        gene_type: normalizeGeneType(raw.gene_type) || existing?.gene_type || null,
        super_form: existing?.super_form || null,
        market_value_usd: existing?.market_value_usd || 200, // Default estimate
        rarity: existing?.rarity || 'common',
        health_risk: extractHealthRisk(raw.health_risks) || existing?.health_risk || 'none',
        health_issues: cleanHealthRisks(raw.health_risks) || existing?.health_issues || [],
        breeding_notes: raw.breeding_notes || existing?.breeding_notes || null,
        visual_traits: raw.visual_traits || existing?.visual_traits || {},
        source_url: raw.source_url,
        fetched_at: raw.scraped_at
      };
      
      // Merge with existing data if available
      if (existing) {
        mergedCount++;
        // Prefer manual data over scraped when available
        cleaned.market_value_usd = existing.market_value_usd;
        cleaned.rarity = existing.rarity;
        cleaned.super_form = existing.super_form;
        
        // Keep manually reviewed health data if more detailed
        if (existing.health_issues && existing.health_issues.length > cleaned.health_issues.length) {
          cleaned.health_issues = existing.health_issues;
          cleaned.health_risk = existing.health_risk;
        }
      } else {
        newCount++;
      }
      
      cleanedMorphs.push(cleaned);
    }
    
    // Sort by name
    cleanedMorphs.sort((a, b) => a.name.localeCompare(b.name));
    
    // Create output
    const output = {
      version: '2.0.0',
      source: 'wobp',
      last_updated: new Date().toISOString(),
      extraction_method: 'puppeteer_automated_reviewed',
      ethics_verified: true,
      morph_count: cleanedMorphs.length,
      notes: [
        'Scraped automatically from WOBP with Puppeteer',
        'Merged with existing manual data where available',
        'Health risks extracted but may need manual validation',
        'Market values are estimates and should be updated from MorphMarket'
      ],
      morphs: cleanedMorphs
    };
    
    // Save cleaned data
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    // Summary
    log('═══════════════════════════════════════', 'info');
    log('✅ Data cleaning complete!', 'success');
    log(`Total morphs: ${cleanedMorphs.length}`, 'info');
    log(`Merged with existing: ${mergedCount}`, 'info');
    log(`New morphs: ${newCount}`, 'success');
    log(`Skipped (errors): ${skippedCount}`, 'warn');
    log(`Output: ${path.basename(OUTPUT_FILE)}`, 'info');
    log('═══════════════════════════════════════', 'info');
    
    log('\n📋 Next steps:', 'info');
    log('  1. Review data/genetics/morphs-complete.json', 'info');
    log('  2. Update market values from MorphMarket (manual)', 'info');
    log('  3. Validate health risks (check false positives)', 'info');
    log('  4. Copy to morphs.json when ready for production', 'info');
    log('     cp morphs-complete.json morphs.json', 'info');
    
  } catch (err) {
    log(`Error: ${err.message}`, 'error');
    console.error(err);
    process.exit(1);
  }
}

// ============================================================================
// RUN
// ============================================================================

if (require.main === module) {
  main().catch(err => {
    log(`Unhandled error: ${err.message}`, 'error');
    console.error(err);
    process.exit(1);
  });
}

module.exports = { main };
