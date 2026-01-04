#!/usr/bin/env node
/**
 * Trigger wrangler CLI to clear all KV namespaces
 * Can be called from browser via worker endpoint or run directly
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Read wrangler.toml to get all KV namespace IDs
const wranglerPath = path.join(__dirname, '../worker/wrangler.toml');
const wranglerToml = fs.readFileSync(wranglerPath, 'utf-8');

// Parse KV namespaces from wrangler.toml
const namespaces = [];
const kvRegex = /binding\s*=\s*"([^"]+)"[\s\S]*?id\s*=\s*"([^"]+)"/g;
let match;

while ((match = kvRegex.exec(wranglerToml)) !== null) {
  namespaces.push({
    binding: match[1],
    id: match[2]
  });
}

console.log(`🗑️  Clearing ${namespaces.length} KV namespaces...\n`);

const results = [];

for (const ns of namespaces) {
  try {
    console.log(`📦 ${ns.binding} (${ns.id})`);
    
    // List all keys
    const listOutput = execSync(
      `npx wrangler kv:key list --namespace-id=${ns.id}`,
      { encoding: 'utf-8', cwd: path.join(__dirname, '../worker') }
    );
    
    const keys = JSON.parse(listOutput);
    console.log(`   Found ${keys.length} keys`);
    
    if (keys.length === 0) {
      results.push({ namespace: ns.binding, deleted: 0, success: true });
      continue;
    }
    
    // Delete each key
    let deleted = 0;
    for (const key of keys) {
      try {
        execSync(
          `npx wrangler kv:key delete "${key.name}" --namespace-id=${ns.id}`,
          { encoding: 'utf-8', cwd: path.join(__dirname, '../worker'), stdio: 'pipe' }
        );
        deleted++;
      } catch (err) {
        console.error(`   ❌ Failed to delete: ${key.name}`);
      }
    }
    
    console.log(`   ✅ Deleted ${deleted}/${keys.length} keys\n`);
    results.push({ namespace: ns.binding, deleted, total: keys.length, success: true });
    
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}\n`);
    results.push({ namespace: ns.binding, success: false, error: err.message });
  }
}

console.log('\n📊 Summary:');
console.log(JSON.stringify(results, null, 2));

const totalDeleted = results.reduce((sum, r) => sum + (r.deleted || 0), 0);
console.log(`\n✅ Total keys deleted: ${totalDeleted}`);
