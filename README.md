# ArmorIQ

An AI Agent Security Platform. A policy-first execution layer that sits between LLMs and the external tools they invoke, ensuring every tool call is evaluated against administrator-defined guardrails before execution.

## Repository Structure

```
armoriq-assignment/
├── apps/
│   ├── agent/          # Express backend — AI agent runtime, LLM orchestration, tool loop, policy enforcement
│   ├── custom-mcp/     # Custom MCP server — infrastructure management tools (restart, deploy, rollback, logs)
│   └── dashboard/      # Next.js frontend — admin console for managing policies, approvals, and audit logs
├── packages/
│   ├── db/             # Prisma client, database schema, and migrations
│   ├── logger/         # Structured logging utility
│   ├── mcp-registry/   # MCP tool discovery and registration
│   ├── policy-engine/  # Core policy evaluation engine (standalone, no framework dependencies)
│   └── shared-types/   # TypeScript types shared across apps and packages
├── prisma/             # Prisma schema and migration files
├── docs/               # Complete engineering documentation
├── scripts/            # Build and utility scripts
├── pnpm-workspace.yaml # pnpm monorepo config
├── turbo.json          # Turborepo pipeline config
└── prisma.config.ts    # Prisma configuration
```

## Documentation

Full engineering documentation is available in the [`docs/`](https://github.com/dexisback/armoriq-assignment/tree/main/docs) directory:

| Document | Description |
|---|---|
| [00 — Project Overview](https://github.com/dexisback/armoriq-assignment/blob/main/docs/00.md) | Project philosophy, problem statement, feature inventory, engineering principles, monorepo architecture |
| [01 — Backend Architecture](https://github.com/dexisback/armoriq-assignment/blob/main/docs/01-backend-architecture.md) | Deep dive into backend services, package architecture, runtime request lifecycle |
| [02 — API Reference](https://github.com/dexisback/armoriq-assignment/blob/main/docs/02-api-reference.md) | Complete REST API reference — `/chat`, `/rules`, `/tools`, `/approvals`, `/logs`, `/health` |
| [03 — Policy Engine](https://github.com/dexisback/armoriq-assignment/blob/main/docs/03-policy-engine.md) | Policy evaluation pipeline, rule types, priority system, Redis sync, caching |
| [04 — Security Model](https://github.com/dexisback/armoriq-assignment/blob/main/docs/04-security-model.md) | Policy-first execution, trust boundaries, prompt injection handling, human approval model |
| [05 — System Design](https://github.com/dexisback/armoriq-assignment/blob/main/docs/05-system-design.md) | Architectural decisions, tradeoffs, runtime design, future evolution |

## Architecture

```
User Prompt → Agent (Express) → LLM (Gemini/Groq)
                    ↓
              Policy Engine ← Rules DB (SQLite)
                    ↓
              MCP Registry → Custom MCP Server
                    ↓
              Tool Execution or Approval Queue
                    ↓
              Audit Logs
```

The **Agent** (apps/agent) receives user prompts, communicates with LLMs, runs a tool loop, evaluates every tool call through the **Policy Engine** (packages/policy-engine), and only executes tools that pass policy checks. Blocked actions enter the **Approval Queue** for human review. All decisions are recorded in the **Audit Log**.

The **Dashboard** (apps/dashboard) is the admin console where security engineers manage policies, approve/reject tool executions, and inspect audit trails.

## Quick Start

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate

# Run database migrations
pnpm run db:migrate

# Start all services in development
pnpm run dev
```

### Individual Services

```bash
# Agent backend (port 3000)
pnpm --filter @armoriq/agent dev

# Dashboard (port 3001)
pnpm --filter @armoriq/dashboard dev

# Custom MCP server
pnpm --filter @armoriq/custom-mcp dev
```

## Tech Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend:** Express, TypeScript
- **LLM Providers:** Gemini 2.5 Pro, Groq (Llama 4)
- **Database:** SQLite via Prisma ORM
- **Cache/PubSub:** Redis
- **Build:** Turborepo + pnpm workspaces
- **Protocol:** Model Context Protocol (MCP)
