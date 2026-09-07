#!/usr/bin/env node
// Cortex connector, stdio bridge.
//
// Exposes the Cortex memory tools over stdio (Model Context Protocol) and
// forwards every call to the hosted Cortex connector (streamable HTTP).
//
//   CORTEX_MCP_URL       remote endpoint (default: the hosted Cortex connector)
//   CORTEX_ACCESS_TOKEN  bearer token for the remote endpoint (optional)
//
// Without a token the server still starts and lists its tools, so MCP
// clients and registries can inspect it; tool calls then return a message
// explaining how to authenticate. With a token, calls are forwarded as they are.

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { TOOLS } from "./tools.js";

const SERVER_NAME = "cortex-connector";
const SERVER_VERSION = "1.1.0";
const DEFAULT_URL = "https://skynetlab-cortex-saas-mcp.cortex-320.workers.dev/mcp";

const remoteUrl = (process.env.CORTEX_MCP_URL || DEFAULT_URL).trim();
const accessToken = (process.env.CORTEX_ACCESS_TOKEN || "").trim();

const NO_TOKEN_MESSAGE =
  "Cortex is a hosted service and this stdio bridge has no access token. " +
  "Set CORTEX_ACCESS_TOKEN to forward calls, or connect the remote connector directly: " +
  "in Claude, Settings > Connectors > Add custom connector with " + DEFAULT_URL + " " +
  "(sign-in creates your account, free trial). Details: https://skynetlab-cortex.com/";

// ---------------------------------------------------------------------------
// Minimal streamable HTTP client for the remote MCP endpoint.
// ---------------------------------------------------------------------------
let sessionId = null;
let rpcId = 1;

function parseBody(contentType, text) {
  if (contentType.includes("text/event-stream")) {
    // Take the last JSON-RPC message carried by the SSE stream.
    let last = null;
    for (const block of text.split(/\n\n+/)) {
      const data = block
        .split("\n")
        .filter((l) => l.startsWith("data:"))
        .map((l) => l.slice(5).trim())
        .join("\n");
      if (!data) continue;
      try {
        const msg = JSON.parse(data);
        if (msg && (msg.result !== undefined || msg.error !== undefined)) last = msg;
      } catch (_) {
        // ignore non-JSON events
      }
    }
    return last;
  }
  if (!text) return null;
  return JSON.parse(text);
}

async function rpc(method, params) {
  const headers = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    authorization: "Bearer " + accessToken,
  };
  if (sessionId) headers["mcp-session-id"] = sessionId;
  const res = await fetch(remoteUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", id: rpcId++, method, params: params || {} }),
  });
  const sid = res.headers.get("mcp-session-id");
  if (sid) sessionId = sid;
  const text = await res.text();
  if (!res.ok) {
    throw new Error("Cortex remote returned HTTP " + res.status + (text ? ": " + text.slice(0, 300) : ""));
  }
  const msg = parseBody(res.headers.get("content-type") || "", text);
  if (!msg) throw new Error("Cortex remote returned an empty response");
  if (msg.error) throw new Error(msg.error.message || JSON.stringify(msg.error));
  return msg.result;
}

let initialized = false;
async function ensureRemoteSession() {
  if (initialized) return;
  await rpc("initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: SERVER_NAME, version: SERVER_VERSION },
  });
  try {
    await fetch(remoteUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
        authorization: "Bearer " + accessToken,
        ...(sessionId ? { "mcp-session-id": sessionId } : {}),
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }),
    });
  } catch (_) {
    // notification delivery is best effort
  }
  initialized = true;
}

// ---------------------------------------------------------------------------
// MCP server over stdio.
// ---------------------------------------------------------------------------
const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  if (accessToken) {
    try {
      await ensureRemoteSession();
      const result = await rpc("tools/list", {});
      if (result && Array.isArray(result.tools) && result.tools.length) return { tools: result.tools };
    } catch (_) {
      // fall back to the static definitions below
    }
  }
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!TOOLS.some((t) => t.name === name)) {
    return { isError: true, content: [{ type: "text", text: "Unknown tool: " + name }] };
  }
  if (!accessToken) {
    return { isError: true, content: [{ type: "text", text: NO_TOKEN_MESSAGE }] };
  }
  try {
    await ensureRemoteSession();
    const result = await rpc("tools/call", { name, arguments: args || {} });
    return result;
  } catch (err) {
    return { isError: true, content: [{ type: "text", text: String(err && err.message ? err.message : err) }] };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
