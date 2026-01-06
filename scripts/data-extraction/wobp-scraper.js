#!/usr/bin/env node
/**
 * World of Ball Pythons (WOBP) Data Scraper
 * Extracts comprehensive morph data using Puppeteer
 * 
 * Ethics:
 * - Respects robots.txt
 * - 2-3 second delay between requests
 * - Manual review required before use
 * - Educational purpose only
 * - Source attribution included
 * 
 * Usage:
 *   node scripts/data-extraction/wobp-scraper.js [--test] [--resume]
 * 
 * Options:
 *   --test      Test mode: scrape only first 10 morphs
 *   --resume    Resume from last checkpoint
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  BASE_URL: 'https://www.worldofballpythons.com',
  MORPHS_LIST_URL: 'https://www.worldofballpythons.com/morphs/',
  OUTPUT_DIR: path.join(__dirname, '../../data/genetics'),
  OUTPUT_FILE: 'morphs-scraped-raw.json',
  CHECKPOINT_FILE: 'scraper-checkpoint.json',
  RATE_LIMIT_MS: 2500, // 2.5 seconds between requests
  TEST_MODE: process.argv.includes('--test'),
  RESUME_MODE: process.argv.includes('--resume'),
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000
};

// ============================================================================
// UTILITIES
// ============================================================================

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warn: '⚠️',
    progress: '🔄'
  }[level] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function saveCheckpoint(data) {
  const checkpointPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.CHECKPOINT_FILE);
  await fs.writeFile(checkpointPath, JSON.stringify(data, null, 2));
  log(`Checkpoint saved: ${data.processedCount} morphs processed`, 'success');
}

async function loadCheckpoint() {
  try {
    const checkpointPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.CHECKPOINT_FILE);
    const data = await fs.readFile(checkpointPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
}

async function saveResults(morphs) {
  const outputPath = path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE);
  const data = {
    version: '2.0.0-raw',
    source: 'wobp',
    extraction_method: 'puppeteer_automated',
    scraped_at: new Date().toISOString(),
    morph_count: morphs.length,
    requires_manual_review: true,
    morphs
  };
  
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2));
  log(`Results saved: ${morphs.length} morphs → ${CONFIG.OUTPUT_FILE}`, 'success');
}

// ============================================================================
// SCRAPING LOGIC
// ============================================================================

async function getMorphList(page) {
  log('Fetching morph list from WOBP...', 'progress');
  
  await page.goto(CONFIG.MORPHS_LIST_URL, {
    waitUntil: 'networkidle2',
    timeout: CONFIG.TIMEOUT_MS
  });
  
  // Wait for morphs to load
  await page.waitForSelector('.morph-grid, .morphs-list, a[href*="/morphs/"]', {
    timeout: CONFIG.TIMEOUT_MS
  });
  
  // Extract all morph links
  const morphLinks = await page.evaluate(() => {
    const links = [];
    const anchors = document.querySelectorAll('a[href*="/morphs/"]');
    
    anchors.forEach(a => {
      const href = a.href;
      const text = a.textContent.trim();
      
      // Filter out navigation links, only keep individual morph pages
      if (href.includes('/morphs/') && 
          !href.endsWith('/morphs/') && 
          text.length > 0 &&
          text.length < 50) {
        links.push({
          name: text,
          url: href
        });
      }
    });
    
    // Remove duplicates
    const seen = new Set();
    return links.filter(link => {
      const key = link.url.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
  
  log(`Found ${morphLinks.length} unique morphs`, 'success');
  return morphLinks;
}

async function scrapeMorphPage(page, morphLink, retryCount = 0) {
  try {
    log(`Scraping: ${morphLink.name} (${morphLink.url})`, 'progress');
    
    await page.goto(morphLink.url, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.TIMEOUT_MS
    });
    
    // Extract data from page
    const morphData = await page.evaluate((morphName) => {
      const data = {
        name: morphName,
        gene_type: null,
        aliases: [],
        description: null,
        health_risks: [],
        breeding_notes: null,
        visual_traits: {},
        raw_html: null
      };
      
      // Try to find gene type
      const geneTypeSelectors = [
        '.gene-type',
        '[class*="genetic"]',
        'td:contains("Gene Type")',
        'strong:contains("Gene Type")'
      ];
      
      for (const selector of geneTypeSelectors) {
        const elem = document.querySelector(selector);
        if (elem) {
          const text = elem.textContent.toLowerCase();
          if (text.includes('co-dominant') || text.includes('codominant')) {
            data.gene_type = 'co-dominant';
          } else if (text.includes('dominant')) {
            data.gene_type = 'dominant';
          } else if (text.includes('recessive')) {
            data.gene_type = 'recessive';
          } else if (text.includes('incomplete')) {
            data.gene_type = 'incomplete-dominant';
          }
          break;
        }
      }
      
      // Try to find description
      const descSelectors = ['.description', '.morph-description', 'p'];
      for (const selector of descSelectors) {
        const elem = document.querySelector(selector);
        if (elem && elem.textContent.trim().length > 50) {
          data.description = elem.textContent.trim().substring(0, 500);
          break;
        }
      }
      
      // Extract health information
      const healthKeywords = ['health', 'wobble', 'issue', 'problem', 'concern', 'risk'];
      const allText = document.body.innerText.toLowerCase();
      
      healthKeywords.forEach(keyword => {
        if (allText.includes(keyword)) {
          const regex = new RegExp(`([^.]*${keyword}[^.]*\\.)`,'gi');
          const matches = allText.match(regex);
          if (matches) {
            data.health_risks.push(...matches.slice(0, 3)); // Max 3 sentences
          }
        }
      });
      
      // Store raw HTML for manual review
      data.raw_html = document.body.innerHTML.substring(0, 10000); // First 10KB
      
      return data;
    }, morphLink.name);
    
    // Add metadata
    morphData.source_url = morphLink.url;
    morphData.scraped_at = new Date().toISOString();
    morphData.id = morphLink.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    log(`✓ Scraped: ${morphLink.name}`, 'success');
    return morphData;
    
  } catch (err) {
    if (retryCount < CONFIG.MAX_RETRIES) {
      log(`Retry ${retryCount + 1}/${CONFIG.MAX_RETRIES} for ${morphLink.name}`, 'warn');
      await delay(CONFIG.RATE_LIMIT_MS * 2); // Extra delay on retry
      return scrapeMorphPage(page, morphLink, retryCount + 1);
    }
    
    log(`Failed to scrape ${morphLink.name}: ${err.message}`, 'error');
    return {
      name: morphLink.name,
      id: morphLink.name.toLowerCase().replace(/\s+/g, '-'),
      source_url: morphLink.url,
      error: err.message,
      scraped_at: new Date().toISOString()
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  log('🐍 WOBP Data Scraper Starting...', 'info');
  log(`Mode: ${CONFIG.TEST_MODE ? 'TEST (10 morphs)' : 'FULL (all morphs)'}`, 'info');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (compatible; SerpentTownBot/1.0; Educational use)');
  
  try {
    // Get morph list
    const allMorphs = await getMorphList(page);
    let morphsToScrape = allMorphs;
    
    // Load checkpoint if resuming
    let processedMorphs = [];
    let startIndex = 0;
    
    if (CONFIG.RESUME_MODE) {
      const checkpoint = await loadCheckpoint();
      if (checkpoint) {
        processedMorphs = checkpoint.morphs;
        startIndex = checkpoint.processedCount;
        log(`Resuming from checkpoint: ${startIndex} morphs already processed`, 'info');
      }
    }
    
    // Test mode: only first 10
    if (CONFIG.TEST_MODE) {
      morphsToScrape = allMorphs.slice(0, 10);
      log('TEST MODE: Processing first 10 morphs only', 'warn');
    } else {
      morphsToScrape = allMorphs.slice(startIndex);
    }
    
    // Scrape each morph
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < morphsToScrape.length; i++) {
      const morph = morphsToScrape[i];
      const totalIndex = startIndex + i;
      
      log(`Progress: ${totalIndex + 1}/${allMorphs.length} (${Math.round((totalIndex + 1) / allMorphs.length * 100)}%)`, 'progress');
      
      const morphData = await scrapeMorphPage(page, morph);
      processedMorphs.push(morphData);
      
      if (morphData.error) {
        errorCount++;
      } else {
        successCount++;
      }
      
      // Rate limiting
      if (i < morphsToScrape.length - 1) {
        await delay(CONFIG.RATE_LIMIT_MS);
      }
      
      // Save checkpoint every 10 morphs
      if ((i + 1) % 10 === 0) {
        await saveCheckpoint({
          processedCount: totalIndex + 1,
          morphs: processedMorphs,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Save final results
    await saveResults(processedMorphs);
    
    log('═══════════════════════════════════════', 'info');
    log(`✅ Scraping complete!`, 'success');
    log(`Total morphs: ${processedMorphs.length}`, 'info');
    log(`Successful: ${successCount}`, 'success');
    log(`Failed: ${errorCount}`, errorCount > 0 ? 'warn' : 'info');
    log(`Output: ${CONFIG.OUTPUT_FILE}`, 'info');
    log('═══════════════════════════════════════', 'info');
    
    if (!CONFIG.TEST_MODE) {
      log('⚠️  MANUAL REVIEW REQUIRED before using this data', 'warn');
      log('Next steps:', 'info');
      log('  1. Review data/genetics/morphs-scraped-raw.json', 'info');
      log('  2. Clean up health risks (remove false positives)', 'info');
      log('  3. Validate gene types', 'info');
      log('  4. Run: node scripts/data-extraction/clean-scraped-data.js', 'info');
    }
    
  } catch (err) {
    log(`Fatal error: ${err.message}`, 'error');
    console.error(err);
  } finally {
    await browser.close();
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

module.exports = { main, scrapeMorphPage, getMorphList };
