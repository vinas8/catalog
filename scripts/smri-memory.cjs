#!/usr/bin/env node
/**
 * SMRI Memory - Store lessons in INDEX.md
 * Like store_memory but writes to .smri/INDEX.md
 * 
 * Usage:
 *   node scripts/smri-memory.js "debugging" "Always check console first"
 */

const fs = require('fs');
const path = require('path');

const [category, lesson] = process.argv.slice(2);

if (!category || !lesson) {
  console.log(`
Usage: node scripts/smri-memory.js <category> <lesson>

Categories:
  debugging    - Debugging workflows and practices
  architecture - Code structure and patterns
  git          - Git workflows
  testing      - Testing practices
  deployment   - Deployment and CI/CD
  security     - Security best practices
  workflow     - Development workflows

Example:
  node scripts/smri-memory.js debugging "Check console before cache"
  `);
  process.exit(1);
}

const indexPath = path.join(__dirname, '../.smri/INDEX.md');
const timestamp = new Date().toISOString().split('T')[0];

// Read current INDEX.md
let content = fs.readFileSync(indexPath, 'utf8');

// Find or create Lessons section
const lessonsSectionRegex = /## 📚 Lessons Learned/;
const lessonExists = lessonsSectionRegex.test(content);

const newLesson = `
**${timestamp} - ${category}:** ${lesson}
`;

if (lessonExists) {
  // Append to existing lessons section
  content = content.replace(
    /(## 📚 Lessons Learned.*?\n)/s,
    `$1${newLesson}`
  );
} else {
  // Create new section at end
  content += `\n---\n\n## 📚 Lessons Learned\n${newLesson}`;
}

// Write back
fs.writeFileSync(indexPath, content);

console.log('✅ Lesson added to .smri/INDEX.md');
console.log(`   Category: ${category}`);
console.log(`   Lesson: ${lesson}`);
console.log('');
console.log('📝 Next: git add .smri/INDEX.md && git commit -m "docs: Add lesson"');
