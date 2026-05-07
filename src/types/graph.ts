export type NodeType = 'document' | 'topic' | 'tag';

export interface BrainNode {
  id: string;
  type: NodeType;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
}

export interface BrainEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
