#!/usr/bin/env node
/**
 * SMRI E2E Test: Security Scenarios
 * Tests P0 security scenarios using scenario-runner.js
 * 
 * Scenarios tested:
 * - S3.5.01: User Hash Validation
 * - S4.5.02: SQL Injection Attempt
 * - S3.5.03: XSS Attempt via Username
 * - S4.4.05: CSRF Attack on Webhook
 * - S5.11.2-12.2.01: Webhook Signature Verification
 * - S4.5.01: Product Schema Validation
 */

import { ScenarioRunner, ScenarioRegistry } from '../../src/modules/common/scenario-runner.js';
import {
  S3_5_01_HashValidation,
  S4_5_02_SQLInjection,
  S3_5_03_XSSUsername,
  S4_4_05_CSRFWebhook,
  S4_4_01_WebhookSignature,
  S4_5_01_SchemaValidation
} from '../../src/modules/common/security-scenarios.js';

// Load environment
import { readFileSync } from 'fs';
const env = {};
try {
  const envFile = readFileSync('.env', 'utf-8');
  envFile.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
  });
} catch (err) {
  console.log('⚠️  No .env file found, using defaults');
}

const WORKER_URL = env.WORKER_URL || 'https://catalog.navickaszilvinas.workers.dev';

console.log('🎯 SMRI E2E Security Scenarios Test\n');
console.log(`Worker URL: ${WORKER_URL}\n`);

// Initialize runner and registry
const runner = new ScenarioRunner({ workerUrl: WORKER_URL });
const registry = runner.registry;

// Register scenarios
console.log('📝 Registering scenarios...');

registry.register('S3.5.01', new S3_5_01_HashValidation({ workerUrl: WORKER_URL }), {
  name: 'User Hash Validation',
  description: 'Tests that invalid hash formats are rejected',
  priority: 'P0'
});

registry.register('S4.5.02', new S4_5_02_SQLInjection({ workerUrl: WORKER_URL }), {
  name: 'SQL Injection Attempt',
  description: 'Tests that SQL injection patterns are rejected',
  priority: 'P0'
});

registry.register('S3.5.03', new S3_5_03_XSSUsername({ workerUrl: WORKER_URL }), {
  name: 'XSS Attempt via Username',
  description: 'Tests that XSS payloads are sanitized',
  priority: 'P0'
});

registry.register('S4.4.05', new S4_4_05_CSRFWebhook({ workerUrl: WORKER_URL }), {
  name: 'CSRF Attack on Webhook',
  description: 'Tests that invalid webhooks are rejected',
  priority: 'P0'
});

registry.register('S5.11.2-12.2.01', new S4_4_01_WebhookSignature({ workerUrl: WORKER_URL }), {
  name: 'Webhook Signature Verification',
  description: 'Tests Stripe signature validation',
  priority: 'P0'
});

registry.register('S4.5.01', new S4_5_01_SchemaValidation({ workerUrl: WORKER_URL }), {
  name: 'Product Schema Validation',
  description: 'Tests schema validation rules',
  priority: 'P0'
});

console.log(`✅ Registered ${registry.getAll().length} scenarios\n`);

// Run all P0 security scenarios
const scenarioResults = [];
const scenariosToRun = registry.getByPriority('P0');

console.log(`🚀 Running ${scenariosToRun.length} P0 security scenarios...\n`);

for (const scenario of scenariosToRun) {
  const code = scenario.code;
  const name = scenario.metadata.name;
  
  process.stdout.write(`⏳ ${code}: ${name}... `);
  
  try {
    const result = await runner.run(code, { useMockKV: false });
    
    if (result.status === 'pass') {
      console.log('✅ PASS');
      scenarioResults.push({ code, name, status: 'pass', result });
    } else {
      console.log('❌ FAIL');
      console.log(`   Errors: ${result.errors.join(', ')}`);
      scenarioResults.push({ code, name, status: 'fail', result });
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    scenarioResults.push({ code, name, status: 'error', error: error.message });
  }
}

// Print summary
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));

const stats = runner.getStats();
console.log(`Total:  ${stats.total}`);
console.log(`Passed: ${stats.passed} ✅`);
console.log(`Failed: ${stats.failed} ❌`);
console.log(`Pass Rate: ${stats.passRate}%`);

console.log('\n' + '='.repeat(60));
console.log('📝 Scenario Details');
console.log('='.repeat(60));

for (const sr of scenarioResults) {
  const icon = sr.status === 'pass' ? '✅' : '❌';
  console.log(`\n${icon} ${sr.code}: ${sr.name}`);
  console.log(`   Status: ${sr.status.toUpperCase()}`);
  
  if (sr.status === 'fail' && sr.result) {
    console.log(`   Errors: ${sr.result.errors.join(', ')}`);
  }
  
  if (sr.status === 'error') {
    console.log(`   Error: ${sr.error}`);
  }
}

console.log('\n' + '='.repeat(60));

// Exit with appropriate code
const exitCode = stats.failed > 0 ? 1 : 0;
if (exitCode === 0) {
  console.log('✅ All security scenarios passed!');
} else {
  console.log('❌ Some scenarios failed. Review errors above.');
}

process.exit(exitCode);
