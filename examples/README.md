# Configuration examples

- **Claude (web / desktop / mobile)** — no file needed: Settings → Connectors → Add custom connector → paste `https://skynetlab-cortex-saas-mcp.cortex-320.workers.dev/mcp`
- **Claude Code** — `claude mcp add --transport http cortex https://skynetlab-cortex-saas-mcp.cortex-320.workers.dev/mcp`
- **`claude-desktop-config.json`** — for MCP clients that only support local (stdio) servers: bridges the remote connector via [`mcp-remote`](https://www.npmjs.com/package/mcp-remote). Requires Node.js 18+. On first run a browser window opens for the Cortex sign-in.

The OAuth sign-in creates your personal Cortex account on first use — no prior registration needed.
