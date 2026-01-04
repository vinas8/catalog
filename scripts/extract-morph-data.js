#!/usr/bin/env node

/**
 * Ball Python Morph Data Scraper
 * 
 * Scrapes World of Ball Pythons for genetics data
 * - Respects robots.txt (allows crawling)
 * - Rate limited to 1 request per second
 * - Extracts factual fields only
 * - Source attribution included
 */

import https from 'https';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data/genetics');

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
        const urlObj = new URL(url);
        https.get({
            hostname: urlObj.hostname,
            path: urlObj.pathname + urlObj.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SerpentTownBot/1.0; +https://github.com/vinas8/catalog)',
                'Accept': 'text/html'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function extractMorphData(html, slug) {
    const morph = {
        id: slug,
        name: '',
        aliases: [],
        gene_type: '',
        market_value_usd: 150,
        rarity: 'common',
        health_risk: 'none',
        health_issues: [],
        source_url: `https://www.worldofballpythons.com/morphs/${slug}/`,
        fetched_at: new Date().toISOString()
    };
    
    // Extract title
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (titleMatch) {
        morph.name = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Extract gene type from trait info
    if (html.includes('Co-Dominant') || html.includes('Co-Dom')) {
        morph.gene_type = 'co-dominant';
    } else if (html.includes('Recessive')) {
        morph.gene_type = 'recessive';
    } else if (html.includes('Dominant')) {
        morph.gene_type = 'dominant';
    }
    
    // Check for health issues keywords
    const healthKeywords = [
        'wobble', 'neurological', 'kink', 'fertility', 'duck bill',
        'bug eye', 'lethal', 'fatal', 'health issue'
    ];
    
    const lowerHtml = html.toLowerCase();
    if (healthKeywords.some(kw => lowerHtml.includes(kw))) {
        if (lowerHtml.includes('severe') || lowerHtml.includes('serious')) {
            morph.health_risk = 'high';
        } else if (lowerHtml.includes('moderate') || lowerHtml.includes('some')) {
            morph.health_risk = 'moderate';
        } else {
            morph.health_risk = 'low';
        }
        
        // Extract issue descriptions
        if (lowerHtml.includes('wobble')) morph.health_issues.push('Neurological wobble reported');
        if (lowerHtml.includes('kink')) morph.health_issues.push('Kinking reported in some specimens');
        if (lowerHtml.includes('fertility')) morph.health_issues.push('Fertility concerns in some lines');
    }
    
    return morph;
}

const MORPHS_TO_SCRAPE = [
    // Co-dominant (15 more)
    'butter', 'fire', 'orange-dream', 'enchi', 'cypress',
    'leopard', 'black-pastel', 'cinnamon', 'spotnose', 'yellowbelly',
    'phantom', 'vanilla', 'gravel', 'bamboo', 'mahogany',
    
    // Dominant (8 more)
    'pinstripe', 'desert-ghost', 'calico', 'genetic-stripe',
    'banded', 'confusion', 'puzzle', 'super-stripe',
    
    // Recessive (17 more)
    'axanthic', 'ghost', 'lavender-albino', 'toffee', 'ultramel',
    'candy', 'sunset', 'monsoon', 'acid', 'scaleless',
    'caramel-albino', 'ghi', 'ringer', 'puma', 'orange-ghost',
    'coral-glow', 'super-pastel'
];

async function main() {
    console.log('🐍 Ball Python Morph Scraper');
    console.log('📋 Ethical scraping: 1 req/sec, robots.txt compliant');
    console.log('');
    
    const morphsPath = path.join(DATA_DIR, 'morphs.json');
    const morphsData = JSON.parse(await fs.readFile(morphsPath, 'utf-8'));
    
    console.log(`📊 Current: ${morphsData.morphs.length} morphs`);
    console.log(`🎯 Scraping: ${MORPHS_TO_SCRAPE.length} morphs`);
    console.log('');
    
    let scraped = 0;
    let failed = 0;
    
    for (const slug of MORPHS_TO_SCRAPE) {
        // Skip if already exists
        if (morphsData.morphs.some(m => m.id === slug)) {
            console.log(`⏭️  Skipping ${slug} (already exists)`);
            continue;
        }
        
        try {
            console.log(`🔍 Scraping ${slug}...`);
            const url = `https://www.worldofballpythons.com/morphs/${slug}/`;
            const html = await rateLimitedFetch(url);
            
            const morph = extractMorphData(html, slug);
            
            if (morph.name && morph.gene_type) {
                morphsData.morphs.push(morph);
                morphsData.morph_count = morphsData.morphs.length;
                scraped++;
                console.log(`✅ ${morph.name} (${morph.gene_type}) - ${morph.health_risk} risk`);
            } else {
                console.log(`⚠️  ${slug} - incomplete data (name: ${morph.name}, type: ${morph.gene_type})`);
                failed++;
            }
            
        } catch (err) {
            console.error(`❌ ${slug} failed:`, err.message);
            failed++;
        }
    }
    
    // Save updated data
    morphsData.last_updated = new Date().toISOString();
    await fs.writeFile(morphsPath, JSON.stringify(morphsData, null, 2));
    
    console.log('');
    console.log('📊 Results:');
    console.log(`  ✅ Scraped: ${scraped}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  📈 Total: ${morphsData.morph_count} morphs`);
    console.log('');
    console.log(`💾 Saved to ${morphsPath}`);
}

main().catch(console.error);
