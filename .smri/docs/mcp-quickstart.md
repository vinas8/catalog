# MCP Quick Reference - Termux/Copilot CLI

**Version:** 0.7.2  
**Environment:** Termux + GitHub Copilot CLI  
**Last Updated:** 2026-01-04

---

## ✅ Configuration Status

### MCP Servers Active:
1. **GitHub MCP** - Full repo access
2. **Filesystem MCP** - `.smri/` directory access

### Location:
- **Config:** `~/.copilot/config.json`
- **Token:** Embedded in config (secure, 600 permissions)
- **Backup:** `~/.copilot/config.json.backup`

---

## 🎯 Available MCP Tools

### GitHub MCP Tools:
```
✅ list_issues          - List issues in repo
✅ get_issue            - Get issue details
✅ search_code          - Search code across repo
✅ get_file_contents    - Read file from repo
✅ list_commits         - View commit history
✅ list_branches        - List branches
✅ list_pull_requests   - List PRs
```

### Filesystem MCP Tools:
```
✅ read_file     - Read .smri docs
✅ write_file    - Update .smri docs
✅ list_files    - List .smri directory
✅ search_files  - Search across docs
```

---

## 💬 Example Prompts

### GitHub MCP:
- "Show me all open issues about Stripe"
- "What changed in worker.js in the last 5 commits?"
- "Search the codebase for KV.put calls"
- "List all PRs merged this week"
- "Show me the contents of src/config/version.js"

### Filesystem MCP:
- "Read .smri/docs/business.md"
- "Search all .smri docs for 'Stripe webhook'"
- "List all files in .smri/scenarios/"
- "Update .smri/docs/mcp-integration.md with usage stats"

### Combined:
- "Search GitHub issues for MCP, then document findings in .smri/docs/mcp-integration.md"
- "Check recent commits and log today's session"

---

## 🔧 Testing MCP

### Test GitHub MCP:
```bash
# In Copilot chat:
"List issues in vinas8/catalog repository"
```

### Test Filesystem MCP:
```bash
# In Copilot chat:
"Read the file .smri/INDEX.md"
```

### Verify Config:
```bash
cat ~/.copilot/config.json | grep -A 5 mcpServers
```

---

## 🚨 Troubleshooting

### If MCP doesn't work:
1. **Check npx:** `which npx && npx --version`
2. **Check config:** `cat ~/.copilot/config.json | grep mcpServers`
3. **Check permissions:** `ls -la ~/.copilot/config.json` (should be 600)
4. **Restart session:** Exit and re-enter Copilot CLI

### If GitHub MCP fails:
- Verify token: `cat ~/.copilot/config.json | grep GITHUB_PERSONAL_ACCESS_TOKEN`
- Check token hasn't expired on GitHub
- Ensure token has `repo` scope

### If Filesystem MCP fails:
- Check path exists: `ls -la /root/catalog/.smri`
- Verify npx can run: `npx -y @modelcontextprotocol/server-filesystem --help`

---

## 📊 Environment Info

### Termux:
- **OS:** Linux aarch64 (PRoot-Distro)
- **Node.js:** v24.11.1
- **npm/npx:** 11.6.2
- **Shell:** Bash

### GitHub Copilot CLI:
- **Version:** 0.0.374
- **Model:** claude-sonnet-4.5
- **Config:** `~/.copilot/config.json`

---

## 🔐 Security Notes

### Tokens Stored:
1. **GitHub PAT:** In `~/.copilot/config.json` (600 permissions)
2. **Copilot Token:** In `~/.copilot/config.json` (600 permissions)

### Access Restrictions:
- Filesystem MCP: Read/write **only** `/root/catalog/.smri`
- GitHub MCP: Full repo access (read/write)

### Best Practices:
- ✅ Config file is 600 (owner only)
- ✅ Tokens not in git
- ✅ Backup created before changes
- ⚠️ Don't share config file
- ⚠️ Rotate tokens if exposed

---

## 🎓 Learning MCP

### Official Docs:
- [MCP Documentation](https://modelcontextprotocol.io)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers)

### Related Serpent Town Docs:
- `.smri/docs/mcp-integration.md` - Full integration plan
- `.smri/INDEX.md` - SMRI system rules
- `.claude-instructions.md` - AI assistant instructions

---

## 🔄 Next Phase: Custom Server

See `.smri/docs/mcp-integration.md` Phase 3 for:
- Custom Serpent Town MCP server
- KV store queries
- Scenario runner integration
- Worker health checks

---

**Status:** ✅ Phase 1 & 2 Complete  
**Ready to use MCP in Copilot CLI!** 🐍
