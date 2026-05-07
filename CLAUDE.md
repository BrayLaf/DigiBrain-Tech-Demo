# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server (HMR)
npm run build     # tsc type-check + Vite production build
npm run lint      # ESLint
npm run preview   # serve the production build locally
```

No test runner is configured yet.

## Architecture

This is a React 19 + TypeScript + Vite app for visualizing a knowledge graph ("digital brain"). Key libraries:

- **`@xyflow/react`** — renders the interactive node-edge graph canvas
- **`zustand`** — global state store for the graph
- **`pdfjs-dist`** — PDF ingestion (planned, not yet wired up)

### Core data model (`src/types/graph.ts`)

```
BrainNode { id, type: 'document'|'topic'|'tag', title, content?, tags?, createdAt }
BrainEdge  { id, source, target, label }
```

### State (`src/store/graphStore.ts`)

Zustand store wrapping all graph mutations. Planned interface:
`addNode`, `updateNode`, `removeNode`, `addEdge`, `removeEdge`.

All graph state lives here; React Flow receives nodes/edges as derived views of this store.

## TypeScript strictness

`tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, and `erasableSyntaxOnly`. Type-only imports must use `import type`.
