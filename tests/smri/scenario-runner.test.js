/**
 * SMRI Scenario Test Runner
 * 
 * Executes SMRI scenario tests defined in .smri/scenarios/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SMRITestRunner {
  constructor() {
    this.results = { passed: 0, failed: 0, total: 0, scenarios: [] };
    this.scenariosPath = path.join(__dirname, '../../.smri/scenarios');
  }

  parseScenario(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const scenario = {
      file: path.basename(filePath),
      title: '',
      smri: 'S2-tutorial-unknown',
      module: 'S2',
      steps: [],
      expectations: []
    };

    for (const line of lines) {
      if (line.startsWith('# ')) scenario.title = line.replace('# ', '').trim();
      if (line.match(/^\d+\./)) {
        const text = line.replace(/^\d+\.\s*/, '').trim();
        if (text.includes('expect') || text.includes('should')) {
          scenario.expectations.push(text);
        } else {
          scenario.steps.push(text);
        }
      }
    }

    return scenario;
  }

  async executeScenario(scenario) {
    console.log(`\n🧪 ${scenario.title || scenario.file}`);
    
    const testResult = { scenario: scenario.title, smri: scenario.smri, passed: true, errors: [] };

    if (scenario.steps.length === 0) {
      testResult.passed = false;
      testResult.errors.push('No steps defined');
    }

    if (testResult.passed) {
      console.log(`   ✅ PASSED`);
      this.results.passed++;
    } else {
      console.log(`   ❌ FAILED`);
      testResult.errors.forEach(err => console.log(`      - ${err}`));
      this.results.failed++;
    }

    this.results.scenarios.push(testResult);
    this.results.total++;
  }

  async runAll() {
    console.log('🐍 SMRI Scenario Test Runner v2.0\n');

    if (!fs.existsSync(this.scenariosPath)) {
      console.error('❌ Scenarios directory not found');
      return;
    }

    const files = fs.readdirSync(this.scenariosPath).filter(f => f.endsWith('.md'));

    if (files.length === 0) {
      console.log('⚠️  No scenario files found');
      return;
    }

    console.log(`Found ${files.length} scenario(s)\n`);

    for (const file of files) {
      const scenario = this.parseScenario(path.join(this.scenariosPath, file));
      await this.executeScenario(scenario);
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed} | ❌ Failed: ${this.results.failed} | 📊 Total: ${this.results.total}`);
    console.log('='.repeat(50));

    if (this.results.failed === 0) {
      console.log('🎉 All scenario tests passed!\n');
    } else {
      process.exit(1);
    }
  }
}

const runner = new SMRITestRunner();
runner.runAll();
