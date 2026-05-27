export type NodeType = 'document' | 'topic' | 'tag' | 'person' | 'memory' | 'message';

// Full graph node stored in Zustand — no index signature so TypeScript enforces the shape.
export interface BrainNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  position: { x: number; y: number };
}

// Presentational subset of BrainNode passed to React Flow node components.
// Extends Record<string, unknown> to satisfy React Flow's Node<TData> constraint
// without polluting BrainNode itself with an index signature escape hatch.
export interface BrainNodeData extends Record<string, unknown> {
  title: string;
  content: string;
  tags: string[];
}

export interface BrainEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
