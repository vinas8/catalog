# MCP Integration Plan

**Version:** 0.7.2  
**Last Updated:** 2026-01-04  
**Status:** Planned

---

## 📖 Overview

**MCP (Model Context Protocol)** is Anthropic's standard for connecting AI assistants to external tools and data sources. This document outlines how MCP can enhance Serpent Town's development workflow.

### Why MCP for Serpent Town?

1. **Standardized tooling** - Replace custom scripts with MCP servers
2. **Better AI context** - Direct access to GitHub, KV store, Stripe
3. **Improved debugging** - Query live Worker state without manual curl
4. **Automated testing** - Run scenarios via MCP instead of bash scripts

---

## 🎯 Three-Phase Integration

### Phase 1: GitHub MCP Server (Foundation)
**Status:** Not Started  
**Priority:** High  
**Estimated Time:** 2 hours

#### Capabilities:
- ✅ List issues and PRs
- ✅ Read file contents
- ✅ View commit history
- ✅ Search code across repo
- ✅ List branches

#### Use Cases:
- "Show me all open issues about Stripe"
- "What changed in worker.js in the last 5 commits?"
- "Find all uses of KV.put in the codebase"

#### Setup:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

#### Required:
- GitHub Personal Access Token with `repo` scope
- Add to `.env`: `GITHUB_TOKEN=ghp_xxxxx`

---

### Phase 2: Filesystem MCP Server (Documentation)
**Status:** Not Started  
**Priority:** Medium  
**Estimated Time:** 1 hour

#### Capabilities:
- ✅ Read/write `.smri/` docs with version control
- ✅ Search across all documentation
- ✅ List files in specific directories
- ✅ Watch for changes

#### Use Cases:
- "Update .smri/docs/business.md with today's changes"
- "Search all docs for 'Stripe webhook'"
- "Show me all files modified today in .smri/"

#### Setup:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/root/catalog/.smri"]
    }
  }
}
```

#### Permissions:
- Read/write access to `.smri/` only
- No access to `node_modules/`, `venv/`, `.git/`

---

### Phase 3: Custom Serpent Town MCP Server (Game Operations)
**Status:** Not Started  
**Priority:** Low (nice-to-have)  
**Estimated Time:** 8-16 hours

#### Capabilities:
- ✅ Query Cloudflare KV store state
- ✅ Run SMRI test scenarios
- ✅ Check Worker API health
- ✅ Trigger Stripe test webhooks
- ✅ List active user sessions
- ✅ View game stats (all snakes)

#### Use Cases:
- "Show me KV state for user test@example.com"
- "Run scenario VCT-1.0 and show results"
- "What's the health status of the Worker API?"
- "Trigger a Stripe test webhook for invoice.payment_succeeded"

#### Architecture:
```
┌─────────────────────┐
│   Claude Desktop    │
│   (MCP Client)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Serpent Town MCP   │
│  Server (Node.js)   │
└──────────┬──────────┘
           │
           ├──────────▶ Cloudflare Worker API
           ├──────────▶ Cloudflare KV (via Wrangler)
           └──────────▶ Local test runners
```

#### Implementation:
```javascript
// mcp-server/serpent-town.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "serpent-town",
  version: "0.7.2"
});

// Tool: Query KV store
server.tool("kv-get", async ({ userId }) => {
  // Use Wrangler CLI or API to query KV
  const result = await queryKV(userId);
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
});

// Tool: Run SMRI scenario
server.tool("run-scenario", async ({ scenarioId }) => {
  // Execute test scenario
  const result = await runScenario(scenarioId);
  return { content: [{ type: "text", text: result }] };
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

#### Setup:
```json
{
  "mcpServers": {
    "serpent-town": {
      "command": "node",
      "args": ["mcp-server/serpent-town.js"],
      "env": {
        "CLOUDFLARE_API_TOKEN": "${CF_API_TOKEN}",
        "CLOUDFLARE_ACCOUNT_ID": "${CF_ACCOUNT_ID}"
      }
    }
  }
}
```

---

## 📂 File Structure

```
/root/catalog/
├── mcp-server/                    # Custom MCP server (Phase 3)
│   ├── serpent-town.js           # Main server
│   ├── tools/
│   │   ├── kv-operations.js      # KV query tools
│   │   ├── scenario-runner.js    # SMRI test runner
│   │   ├── worker-health.js      # API health checks
│   │   └── stripe-webhooks.js    # Stripe test tools
│   ├── package.json
│   └── README.md
├── .mcp-config.json              # MCP client configuration
└── .env.mcp                      # MCP environment variables
```

---

## 🔐 Security Considerations

### Tokens Required:
1. **GitHub Token** - Read/write repo access
2. **Cloudflare API Token** - KV read, Worker API access
3. **Stripe Test Token** - Webhook simulation only

### Best Practices:
- ✅ Store tokens in `.env.mcp` (gitignored)
- ✅ Use read-only tokens when possible
- ✅ Limit filesystem access to `.smri/` only
- ✅ Never expose production Stripe keys
- ❌ Do NOT commit tokens to git
- ❌ Do NOT use production KV in MCP tools

---

## 🧪 Testing Strategy

### Phase 1 Testing (GitHub MCP):
```bash
# Install MCP CLI
npm install -g @modelcontextprotocol/cli

# Test GitHub server
mcp test github list-repos --owner vinas8

# Verify in Claude Desktop
# Prompt: "Show me recent commits in vinas8/catalog"
```

### Phase 2 Testing (Filesystem MCP):
```bash
# Test file read
mcp test filesystem read-file --path /root/catalog/.smri/INDEX.md

# Verify in Claude Desktop
# Prompt: "Search .smri docs for 'SMRI commands'"
```

### Phase 3 Testing (Custom Server):
```bash
# Start server
cd mcp-server && node serpent-town.js

# Test KV query
echo '{"method": "kv-get", "params": {"userId": "test@example.com"}}' | node serpent-town.js

# Verify in Claude Desktop
# Prompt: "Show me KV state for test@example.com"
```

---

## 📊 Implementation Checklist

### Phase 1: GitHub MCP
- [ ] Create GitHub Personal Access Token
- [ ] Add token to `.env.mcp`
- [ ] Configure `.mcp-config.json`
- [ ] Test in Claude Desktop
- [ ] Document usage in `.smri/docs/mcp-integration.md`

### Phase 2: Filesystem MCP
- [ ] Configure filesystem server for `.smri/`
- [ ] Test read/write operations
- [ ] Verify `.smri log` and `.smri add` work via MCP
- [ ] Update `.claude-instructions.md` with MCP commands

### Phase 3: Custom Server
- [ ] Create `mcp-server/` directory
- [ ] Implement KV query tool
- [ ] Implement scenario runner tool
- [ ] Implement Worker health check tool
- [ ] Implement Stripe webhook tool
- [ ] Write tests for each tool
- [ ] Document API in `mcp-server/README.md`

---

## 🎯 Success Criteria

### Phase 1 Success:
- AI can list GitHub issues without manual API calls
- AI can search codebase without grep commands
- AI can view commit history without git log

### Phase 2 Success:
- AI can update `.smri/` docs without view/edit tools
- AI can search all docs without grep
- `.smri log` and `.smri add` work seamlessly

### Phase 3 Success:
- AI can query live KV state without curl
- AI can run test scenarios without bash scripts
- AI can check Worker health without manual testing
- AI can trigger Stripe webhooks without manual setup

---

## 📚 Resources

### Official Docs:
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop MCP Guide](https://docs.anthropic.com/claude/docs/model-context-protocol)

### Example Servers:
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Filesystem MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- [SQLite MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite) (reference for custom server)

### Related Serpent Town Docs:
- `.smri/INDEX.md` - SMRI system rules
- `.smri/docs/technical.md` - Technical architecture
- `.smri/docs/testing.md` - Test strategy
- `.claude-instructions.md` - AI assistant rules

---

## 🔄 Migration Plan

### Current Workflow → MCP Workflow

| Current | With MCP |
|---------|----------|
| `git log --oneline -20` | "Show recent commits" |
| `grep -r "pattern" src/` | "Search code for pattern" |
| `curl worker-api/health` | "Check Worker health" |
| `node tests/smri/scenario-runner.js VCT-1.0` | "Run scenario VCT-1.0" |
| `view .smri/docs/business.md` | "Show me business docs" |
| `.smri add` → manual edit | "Add this to .smri docs" → automatic |

---

## 🚀 Next Steps

1. **Immediate (Phase 1):**
   - Generate GitHub token
   - Configure `.mcp-config.json`
   - Test GitHub MCP in Claude Desktop

2. **Short-term (Phase 2):**
   - Add Filesystem MCP for `.smri/`
   - Update `.claude-instructions.md`
   - Test documentation workflows

3. **Long-term (Phase 3):**
   - Design custom server API
   - Implement KV and scenario tools
   - Integrate with Worker API
   - Build Stripe webhook simulator

---

## 💡 Future Enhancements

### Potential MCP Tools (Post-Phase 3):
1. **Database MCP** - Direct SQLite access for user data
2. **Stripe MCP** - Official Stripe MCP integration (if available)
3. **Analytics MCP** - Query game stats, user metrics
4. **Deployment MCP** - Trigger Worker deployments via MCP
5. **Monitoring MCP** - View error logs, performance metrics

---

**Built with ❤️ and 🐍**  
**Last Updated:** 2026-01-04T03:20:00Z  
**Status:** Ready for Phase 1 implementation
