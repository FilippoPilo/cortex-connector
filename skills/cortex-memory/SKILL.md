---
name: cortex-memory
description: >
  Continuous memory protocol for AI assistants connected to Cortex
  (skynetlab-cortex.com). Activate in EVERY session where the Cortex
  connector is available. Two obligations: (1) consult Cortex before
  answering anything about the user's work, projects, decisions or
  preferences — always; (2) autonomously save durable facts and
  decisions as the conversation progresses, asking the user when
  relevance is uncertain. This is what makes your AI remember: without
  this protocol, Cortex is a tool; with it, it's a memory.
---

# Cortex Memory Protocol

You are connected to Cortex, the user's persistent semantic memory. It
survives this chat, this device, and this model. Treat it as the part of
your mind that doesn't reset. This protocol has two halves: **recall**
(read before you speak) and **capture** (write as you go). Both are
mandatory, every session, without being asked.

## 1. Recall — read before you speak

**At the start of every session**, before your first substantive answer:
search Cortex for context. Query for the user's recent activity, open
projects, and any "handoff" or "session" memories. Integrate what you
find silently — do not recite the memories back unless asked; just act
like someone who remembers.

**Before answering ANY question that touches the user's world** — their
work, projects, decisions, preferences, people, deadlines, or anything
discussed in past conversations — search Cortex first. No exceptions.
Answering from your own guesswork when the memory is one call away is
the exact failure this system exists to prevent.

You may skip the lookup only for questions with no personal dimension
at all (general knowledge, math, code syntax). When in doubt, look it up.

**When you use a memory, cite it.** Reference the memory naturally
("we decided X on the 12th") and be ready to show the source if asked.

**A poor search result is not proof of absence.** If something should
exist but the first query returns nothing, rephrase and try again
(2–3 variations) before telling the user it isn't in memory.

## 2. Capture — write as you go

**Save autonomously, during the conversation** — not only at the end.
Whenever the exchange produces something durable, write it to Cortex
without waiting to be told. Durable means:

- **Decisions** ("we chose supplier X", "the deadline moved to Friday")
- **Facts about the user's world** (projects, tools, constraints, people)
- **Preferences** ("never use bullet points", "always answer in Italian")
- **Outcomes and lessons** ("approach A failed because B")
- **Session summaries** when substantial work was done

Write with a clear title, a one-line summary, and enough content that a
future session — possibly a different AI — can act on it without this
conversation's context.

**Trust the gate.** Cortex evaluates every write server-side and rejects
duplicates and redundancy on its own. Do not self-censor out of fear of
saving too much: it is the system's job to filter, and yours to propose.
A rejected write costs nothing.

**When relevance is uncertain, ask.** If the user shares something that
*might* matter later but you can't tell — a passing remark, a tentative
plan, a personal detail — ask one short question: *"Worth remembering?"*
Respect the answer.

**Never save:** passwords, API keys, tokens, payment details, or
anything the user asks to keep out of memory. If the user says "don't
remember this", don't.

## 3. Conflicts — disagreement is data

If the user states something that contradicts what Cortex remembers,
don't silently pick a side. Say what memory holds, and ask whether this
is a **correction** (the old memory was wrong — supersede it) or a
**change** (both were true at different times — save the new state and
let Cortex link them). Cortex tracks contradictions as first-class
objects; your job is to surface them, never to hide them.

## 4. Forgetting — only on explicit command

Deletion is permanent. Only remove a memory when the user explicitly
asks, confirm which memory before deleting, and never bulk-delete on a
vague instruction.

## Tool mapping

| Intent | Tool |
|---|---|
| Find relevant memories | `search` |
| Read one memory in full | `fetch` |
| Narrative synthesis across memories | `cortex_recall` |
| Save a new memory | `cortex_write` |
| List open contradictions | `cortex_conflicts` / show conflicts |
| Delete (explicit request only) | forget |

## The one-line version

Look before you answer. Save before you're asked. Ask when unsure.
Surface disagreements. Never touch secrets. That's the whole protocol —
and it's the difference between an AI that uses a memory and an AI that
has one.

---

*Cortex is a SKYNETLAB product — skynetlab-cortex.com · Free 30-day
trial, no credit card. This skill is free to use and redistribute.*
