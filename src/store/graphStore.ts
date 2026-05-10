import { create } from 'zustand';
import type { BrainNode, BrainEdge } from '../types/graph';

interface GraphState {
  nodes: BrainNode[];
  edges: BrainEdge[];
  addNode: (node: BrainNode) => void;
  updateNode: (id: string, patch: Partial<BrainNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: BrainEdge) => void;
  updateEdge: (id: string, patch: Partial<BrainEdge>) => void;
  removeEdge: (id: string) => void;
  removeEdges: (ids: string[]) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  edges: [],

  addNode: (node) =>
    set((state) => ({ nodes: [...state.nodes, node] })),

  updateNode: (id, patch) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    })),

  addEdge: (edge) =>
    set((state) => ({ edges: [...state.edges, edge] })),

  updateEdge: (id, patch) =>
    set((state) => ({
      edges: state.edges.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),

  removeEdge: (id) =>
    set((state) => ({ edges: state.edges.filter((e) => e.id !== id) })),

  removeEdges: (ids) => {
    const idSet = new Set(ids);
    set((state) => ({ edges: state.edges.filter((e) => !idSet.has(e.id)) }));
  },
}));
