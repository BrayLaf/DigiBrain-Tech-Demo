# Digibrain — Tech Demo

A single-page interactive proof of concept for Digibrain's core mechanic: visualizing knowledge as a connected graph.

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

> **Note:** This is a limited tech demo and not representative of the full Digibrain application.
