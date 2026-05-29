<p align="center">
  <img src="public/kaika-logo.svg" alt="Kaika" height="72" />
</p>

<p align="center"><em>開花 · the moment of bloom</em></p>

<br/>

# Kaika — Tech Demo

Knowledge doesn't live in documents — it blooms. Kaika maps what you know as a living graph: people, ideas, decisions, and memories branching outward, with new nodes arriving as the work unfolds.

This is a single-page interactive proof of concept for Kaika's core mechanic.

[Live Demo](https://kaika-tech-demo.vercel.app/)

## What it does

Choose a pre-built scenario (or start blank) and explore an interactive knowledge graph. You can:

- **Click any node** to read its full content and see connected nodes
- **Create and edit nodes** with the "Add Node" button — each node links to a person, an optional topic, and tags
- **Draw edges** between nodes by dragging from one handle to another
- **Double-click an edge** to add or edit its label
- **Search nodes** by title or content (⌘K), with dim-out highlighting
- **Auto-layout** with Dagre to organize nodes automatically, or drag freely in Free mode

No backend, no persistence. Refresh and it's gone.

## Stack

- Vite + React 19 + TypeScript
- [@xyflow/react](https://reactflow.dev) — graph rendering
- [zustand](https://zustand-demo.pmnd.rs) — state management
- [dagre](https://github.com/dagrejs/dagre) — automatic graph layout
- [react-markdown](https://github.com/remarkjs/react-markdown) — node content rendering

## Run locally

```bash
git clone https://github.com/BrayLaf/DigiBrain-Tech-Demo.git
cd DigiBrain-Tech-Demo
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Roadmap

- PDF and text file ingestion (auto-graph from uploaded documents)
- Graph persistence / export

---

> **Note:** This is a limited tech demo and not representative of the full Kaika application.
