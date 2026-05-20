import { graphlib, layout } from '@dagrejs/dagre';
import type { BrainNode, BrainEdge, NodeType } from '../types/graph';

const NODE_SIZES: Record<NodeType, { w: number; h: number }> = {
  document: { w: 200, h: 80 },
  topic:    { w: 220, h: 56 },
  tag:      { w: 120, h: 32 },
  person:   { w: 200, h: 56 },
  memory:   { w: 200, h: 80 },
  message:  { w: 200, h: 80 },
};

export function applyDagreLayout(nodes: BrainNode[], edges: BrainEdge[]): BrainNode[] {
  const g = new graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 50 });

  for (const n of nodes) {
    const { w, h } = NODE_SIZES[n.type];
    g.setNode(n.id, { width: w, height: h });
  }

  for (const e of edges) {
    if (g.hasNode(e.source) && g.hasNode(e.target)) {
      g.setEdge(e.source, e.target);
    }
  }

  layout(g);

  return nodes.map((n) => {
    const pos = g.node(n.id);
    if (!pos) return n;
    const { w, h } = NODE_SIZES[n.type];
    return { ...n, position: { x: pos.x - w / 2, y: pos.y - h / 2 } };
  });
}

/** Stable key for detecting topology changes (ignores positions and content). */
export function graphTopologyKey(nodes: BrainNode[], edges: BrainEdge[]): string {
  const nodeIds = nodes.map((n) => n.id).sort().join(',');
  const edgeIds = edges.map((e) => `${e.source}→${e.target}`).sort().join(',');
  return `${nodeIds}|${edgeIds}`;
}
