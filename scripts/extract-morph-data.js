#!/usr/bin/env node

/**
 * Ethical Ball Python Morph Data Extractor
 * 
 * Extracts factual genetics data from World of Ball Pythons
 * Following strict ethical guidelines:
 * - Respects robots.txt (checked: allows all crawling)
 * - Rate limited to 1 request per second
 * - Extracts factual fields only (no verbatim text)
 * - Stores normalized JSON (no HTML)
 * - Includes source attribution
 */

import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data/genetics');

// Rate limiting: 1 request per second
const RATE_LIMIT_MS = 1000;
let lastRequestTime = 0;

async function rateLimitedFetch(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < RATE_LIMIT_MS) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_MS - timeSinceLastRequest));
    }
    lastRequestTime = Date.now();
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

/**
 * Extract factual morph data from WOBP page
 * Returns normalized data, NOT verbatim HTML
 */
function extractMorphData(html, url) {
    // This is a TEMPLATE function - requires manual implementation
    // based on WOBP's page structure
    
    // Example extraction (needs to be adapted to actual HTML structure):
    const morph = {
        id: '', // lowercase slug
        name: '', // extracted from title
        aliases: [], // extracted from page
        gene_type: '', // dominant/co-dominant/recessive
        market_value_usd: null, // estimated range
        rarity: '', // common/uncommon/rare/very_rare
        health_risk: 'none', // none/low/moderate/high
        health_issues: [], // summarized in our words
        source_url: url,
        fetched_at: new Date().toISOString()
    };
    
    return morph;
}

/**
 * List of morphs to extract (start with most common)
 */
const MORPHS_TO_EXTRACT = [
    // Co-dominant
    'banana', 'pastel', 'mojave', 'lesser', 'butter', 'fire',
    'orange-dream', 'enchi', 'pinstripe', 'cypress',
    
    // Dominant
    'spider', 'clown', 'yellowbelly', 'phantom', 'hidden-gene-woma',
    
    // Recessive
    'albino', 'piebald', 'axanthic', 'ghost', 'clown', 'desert-ghost',
    'lavender-albino', 'toffee', 'ultramel',
    
    // Complex/Super forms
    'super-banana', 'black-pastel', 'cinnamon', 'champagne'
];

async function main() {
    console.log('🐍 Ball Python Morph Data Extractor');
    console.log('📋 Ethical Guidelines:');
    console.log('  ✓ robots.txt checked (allows crawling)');
    console.log('  ✓ Rate limited to 1 req/sec');
    console.log('  ✓ Factual extraction only');
    console.log('  ✓ Source attribution included');
    console.log('');
    
    // Load existing data
    const morphsPath = path.join(DATA_DIR, 'morphs.json');
    const morphsData = JSON.parse(await fs.readFile(morphsPath, 'utf-8'));
    
    console.log(`📊 Current morphs: ${morphsData.morphs.length}`);
    console.log(`🎯 Target morphs: ${MORPHS_TO_EXTRACT.length}`);
    console.log('');
    console.log('⚠️  MANUAL EXTRACTION REQUIRED');
    console.log('');
    console.log('This script provides the STRUCTURE for ethical extraction.');
    console.log('To extract data:');
    console.log('  1. Visit https://www.worldofballpythons.com/morphs/');
    console.log('  2. For each morph, manually read and extract:');
    console.log('     - Morph name and aliases');
    console.log('     - Gene type (dom/co-dom/rec)');
    console.log('     - Known health issues (SUMMARIZE in your words)');
    console.log('     - Approximate market value');
    console.log('  3. Add to morphs.json following the schema below');
    console.log('');
    console.log('📝 Schema Template:');
    console.log(JSON.stringify({
        id: 'banana',
        name: 'Banana',
        aliases: ['Coral Glow'],
        gene_type: 'co-dominant',
        market_value_usd: 150,
        rarity: 'common',
        health_risk: 'low',
        health_issues: ['super_form_male_fertility_issues'],
        description: 'Yellow/lavender pattern - our summary',
        source_url: 'https://www.worldofballpythons.com/morphs/banana/',
        fetched_at: new Date().toISOString()
    }, null, 2));
    console.log('');
    console.log('🚫 DO NOT:');
    console.log('  - Copy descriptions verbatim');
    console.log('  - Download images');
    console.log('  - Scrape automatically without reviewing each page');
    console.log('');
    console.log('✅ DO:');
    console.log('  - Read each morph page');
    console.log('  - Extract factual genetics info');
    console.log('  - Summarize health issues in your own words');
    console.log('  - Include source URL and timestamp');
}

main().catch(console.error);
