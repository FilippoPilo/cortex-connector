// Self test: starts the stdio server, sends initialize and tools/list,
// and checks that seven tools come back. Usage: node server/selftest.js
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const child = spawn(process.execPath, [join(here, "index.js")], {
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env, CORTEX_ACCESS_TOKEN: "" },
});

const messages = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "selftest", version: "0" } } },
  { jsonrpc: "2.0", method: "notifications/initialized" },
  { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
  { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "search", arguments: { query: "test" } } },
];

let buf = "";
const seen = {};
child.stdout.on("data", (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id !== undefined) seen[msg.id] = msg;
    if (seen[1] && seen[2] && seen[3]) finish();
  }
});

for (const m of messages) child.stdin.write(JSON.stringify(m) + "\n");

const timer = setTimeout(() => {
  console.error("selftest: timeout");
  child.kill();
  process.exit(1);
}, 10000);

function finish() {
  clearTimeout(timer);
  const tools = seen[2].result && seen[2].result.tools ? seen[2].result.tools : [];
  const ok = seen[1].result && seen[1].result.serverInfo && tools.length === 7 && seen[3].result && seen[3].result.isError === true;
  console.log("initialize:", seen[1].result ? seen[1].result.serverInfo.name + " " + seen[1].result.serverInfo.version : "FAILED");
  console.log("tools/list:", tools.map((t) => t.name).join(", "));
  console.log("tools/call without token:", seen[3].result && seen[3].result.isError ? "handled (isError)" : "UNEXPECTED");
  child.kill();
  process.exit(ok ? 0 : 1);
}
