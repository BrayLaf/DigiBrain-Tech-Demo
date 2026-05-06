# Digibrain — Tech Demo

A single-page proof of concept for Digibrain's core mechanic: automatic knowledge graph construction from uploaded documents.

## What it does

Enter your name, upload a text file or PDF, and watch a live graph materialize — nodes for concepts, edges for relationships, all derived from your document in the browser. No backend, no persistence. Refresh and it's gone.

This demo exists to show one thing: documents becoming graphs, instantly.

## Stack

- Vite + React + TypeScript
- [React Flow](https://reactflow.dev) — graph rendering
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) — in-browser PDF parsing

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

---

> **Note:** This is a limited tech demo and not representative of the full Digibrain application.
