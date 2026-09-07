// Static tool definitions, mirrored from the hosted Cortex connector.
// Used for introspection when no access token is configured, and as a
// fallback when the remote endpoint cannot be reached.

export const TOOLS = [
  {
    name: "search",
    title: "Search memories",
    description:
      "Search the user's persistent memory (Cortex). Call it at the start of every conversation and before any answer that depends on who the user is or on what you did together before: the user must not have to repeat themselves. Returns results with id, title and url to cite. If it returns nothing, the memory is new or empty: tell the user once that you are connected to Cortex and offer to save what you are working on with cortex_write.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Natural language query" } },
      required: ["query"],
    },
    annotations: { title: "Search memories", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "fetch",
    title: "Fetch memory",
    description: "Fetch the full text of a memory by its id (from search), with its history and sources. Cite its url when you use it.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Memory id" } },
      required: ["id"],
    },
    annotations: { title: "Fetch memory", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "cortex_recall",
    title: "Recall & synthesize",
    description:
      "Narrative synthesis of what the user's memory knows about a topic, with the current state and what was superseded. Use it for questions like 'what do you know about X' or 'what is the current state of X'.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string", description: "Topic or question" } },
      required: ["query"],
    },
    annotations: { title: "Recall & synthesize", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "cortex_write",
    title: "Save memory",
    description:
      "Save to the user's persistent memory (Cortex), on your own initiative while the conversation goes on: decisions and the reason behind them, stable facts about the person and their work, preferences and constraints they state, conclusions reached after effort, mistakes made and what they cost. Every write passes a quality gate: duplicates are rejected by the server and a refused write is not an error. Never save passwords, tokens, keys or card numbers.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Short title" },
        content: { type: "string", description: "Text to remember, in the user's language" },
        tags: { type: "array", items: { type: "string" } },
        basis: {
          type: "string",
          enum: ["observed", "inferred"],
          description: "'observed' if read from a concrete source (document, tool output, real data), 'inferred' if it is a deduction or an estimate.",
        },
        claims: {
          type: "array",
          description: "Optional. Atomic facts already structured, one per decision or statement; if given, conflict detection uses them directly. Example: {subject: 'Project Vega', predicate: 'adopts', object: 'Redis'}.",
          items: {
            type: "object",
            properties: {
              claim_text: { type: "string" },
              subject: { type: "string" },
              predicate: { type: "string" },
              object: { type: "string" },
              confidence: { type: "number" },
            },
            required: ["subject", "predicate", "object"],
          },
        },
      },
      required: ["title", "content"],
    },
    annotations: { title: "Save memory", readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "cortex_write_status",
    title: "Write status",
    description: "Outcome of a save that cortex_write returned as queued: verdict of the quality gate and any open conflicts.",
    inputSchema: {
      type: "object",
      properties: { job_id: { type: "string", description: "job_id returned by cortex_write" } },
      required: ["job_id"],
    },
    annotations: { title: "Write status", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "cortex_conflicts",
    title: "Show conflicts",
    description: "Show the contradictions detected between memories, with their open or resolved state.",
    inputSchema: { type: "object", properties: {} },
    annotations: { title: "Show conflicts", readOnlyHint: true, destructiveHint: false, openWorldHint: true },
  },
  {
    name: "cortex_forget",
    title: "Forget memory",
    description: "Delete a memory given its id. Ask the user for explicit confirmation first.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "id of the memory to delete" } },
      required: ["id"],
    },
    annotations: { title: "Forget memory", readOnlyHint: false, destructiveHint: true, openWorldHint: true },
  },
];
