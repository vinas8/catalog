# Contributing to Serpent Town

Thank you for your interest in contributing! 🐍

## 🚀 Quick Start

1. **Clone and setup**
   ```bash
   git clone https://github.com/vinas8/catalog.git
   cd catalog
   npm install
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check health before committing**
   ```bash
   npm run dev:check
   ```

## 📋 Development Workflow

### Before Making Changes
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Check current health: `npm run dev:check`

### During Development
1. Write tests for new features
2. Follow existing code patterns
3. Update documentation in `.smri/docs/`
4. Keep commits atomic and descriptive

### Before Committing
1. Run tests: `npm test`
2. Check architecture: `npm run dev:architecture`
3. Check consistency: `npm run dev:consistency`
4. Fix any issues found

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Maintenance tasks

Examples:
```
feat: Add snake breeding calculator
fix: Resolve KV sync timing issue
docs: Update SMRI scenario format
```

## 🏗️ Architecture Guidelines

### Module System (S0-S9)
All modules in `src/modules/` must have:
- `index.js` with `export const ENABLED = true`
- Clean facade pattern (public API only)
- No circular dependencies
- Entry in `src/config/smri/module-functions.js`

### File Organization
- Frontend HTML: Project root
- Source modules: `src/modules/`
- Tests: `tests/`
- Debug tools: `debug/`
- Documentation: `.smri/`
- Scripts: `scripts/`

### SMRI Documentation Rules
1. **Only INDEX.md in `.smri/` root**
2. Topic docs go in `.smri/docs/`
3. Scenarios in `.smri/scenarios/`
4. Session logs in `.smri/logs/`
5. Keep docs under 500 lines (split if needed)

## ✅ Quality Standards

### Tests Required
- Unit tests for new functions
- Snapshot tests for UI changes
- SMRI scenarios for user flows
- Must maintain 90%+ pass rate

### Code Quality
- Max 1000 lines per .js file
- Max 500 lines per .md file
- No circular dependencies
- Clean module facades
- Consistent naming

### Health Checks
Run before every commit:
```bash
npm run dev:check
```

**Target Scores:**
- Consistency: 5/6 or higher (83%)
- Architecture: 3/3 (100%)

## 📝 Documentation

### When to Document
- New features → `.smri/docs/`
- Bug fixes → Session log + update relevant doc
- Architecture changes → Update `.smri/INDEX.md`
- API changes → Update `src/PUBLIC-API.md`

### Session Logs
After significant work:
```bash
# Document session in .smri/logs/YYYY-MM-DD.md
```

## 🐛 Bug Reports

Include:
1. Expected behavior
2. Actual behavior
3. Steps to reproduce
4. Browser/environment details
5. Health check output (`npm run dev:check`)

## 💡 Feature Requests

Include:
1. Use case description
2. Proposed solution
3. Alternative solutions considered
4. Impact on existing features

## 🔍 Pull Request Process

1. Update documentation
2. Add/update tests
3. Run health checks: `npm run dev:check`
4. Pass all tests: `npm test`
5. Fill out PR template
6. Link related issues
7. Request review

**PR will be rejected if:**
- Tests fail
- Health checks fail significantly
- No documentation updates
- Breaking changes without discussion

## 🎯 Development Tools

### Health Checks
```bash
npm run dev:check          # Full health check
npm run dev:consistency    # Version, structure, duplicates
npm run dev:architecture   # Dependencies, coupling, complexity
```

### Testing
```bash
npm test                   # Fast tests (88 tests)
npm run test:all           # All tests including slow
npm run test:smri          # SMRI scenarios only
```

### Utilities
```bash
node scripts/scan-functions.cjs  # Update function catalog
bash scripts/deploy-worker-api.sh # Deploy worker
```

## 📊 Current Status

**Version:** 0.7.7  
**Tests:** 88 (98% passing)  
**Modules:** 10  
**Architecture Score:** 100%  
**Consistency Score:** 67%

See `.smri/logs/2026-01-13-finalization.md` for full details.

## 🤝 Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn and grow
- Document your decisions
- Test your changes thoroughly

## 📚 Resources

- [Project README](README.md)
- [Architecture Guide](.smri/INDEX.md)
- [Public API](src/PUBLIC-API.md)
- [SMRI System](.smri/docs/)

## ❓ Questions?

Open an issue or check existing documentation in `.smri/docs/`.

---

**Built with ❤️ and 🐍**
