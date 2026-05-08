export type NodeType = 'document' | 'topic' | 'tag' | 'person' | 'memory' | 'message';

export interface BrainNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  position: { x: number; y: number };
  [key: string]: unknown;
}

export interface BrainEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
