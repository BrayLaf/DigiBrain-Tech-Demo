import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './nodes/nodes.css';
import { useGraphStore } from '../store/graphStore';
import { genId } from '../utils/id';
import type { BrainNodeData } from '../types/graph';
import DocumentNode from './nodes/DocumentNode';
import TopicNode from './nodes/TopicNode';
import TagNode from './nodes/TagNode';
import PersonNode from './nodes/PersonNode';
import MemoryNode from './nodes/MemoryNode';
import MessageNode from './nodes/MessageNode';

const nodeTypes = {
  document: DocumentNode,
  topic: TopicNode,
  tag: TagNode,
  person: PersonNode,
  memory: MemoryNode,
  message: MessageNode,
};

// Module-scope constant so React Flow's shallow style comparison can bail out correctly.
const DIMMED_STYLE = { opacity: 0.3 } as const;

// Empty registry at module scope — drop custom edge types in here when needed.
const edgeTypes = {};

interface GraphCanvasProps {
  onNodeClick?: (nodeId: string) => void;
  onPaneClick?: () => void;
  searchQuery?: string;
  focusTarget?: { id: string; ts: number } | null;
  layoutMode?: 'free' | 'auto';
}

// Rendered inside <ReactFlow> so it can access the React Flow context via useReactFlow.
function FitViewTrigger({ target }: { target: { id: string; ts: number } | null | undefined }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (!target) return;
    fitView({ nodes: [{ id: target.id }], duration: 600, padding: 0.8, maxZoom: 1.5 });
  }, [target, fitView]);
  return null;
}

interface EdgeLabelEdit {
  id: string;
  label: string;
  x: number;
  y: number;
}

export default function GraphCanvas({ onNodeClick, onPaneClick, searchQuery = '', focusTarget, layoutMode = 'free' }: GraphCanvasProps) {
  const brainNodes = useGraphStore((s) => s.nodes);
  const brainEdges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const storeAddEdge = useGraphStore((s) => s.addEdge);
  const storeUpdateEdge = useGraphStore((s) => s.updateEdge);
  const storeRemoveEdges = useGraphStore((s) => s.removeEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BrainNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [editingEdge, setEditingEdge] = useState<EdgeLabelEdit | null>(null);
  const edgeEditCancelled = useRef(false);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    const matchedIds = q.length > 0
      ? new Set(
          brainNodes
            .filter((n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q),
            )
            .map((n) => n.id),
        )
      : null;

    setNodes(
      brainNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        // Only pass the presentational subset — avoids id/position duplication on node.data
        data: { title: n.title, content: n.content, tags: n.tags },
        style: matchedIds && !matchedIds.has(n.id) ? DIMMED_STYLE : undefined,
        className: matchedIds?.has(n.id) ? 'search-highlight' : undefined,
      })),
    );
  }, [brainNodes, searchQuery, setNodes]);

  useEffect(() => {
    setEdges(
      brainEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        type: 'default',
      })),
    );
  }, [brainEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) return;
      storeAddEdge({
        id: genId(),
        source: connection.source,
        target: connection.target,
      });
    },
    [storeAddEdge],
  );

  // Sync React Flow edge deletions (keyboard) back to the store in one set call.
  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      const removedIds = changes.filter((c) => c.type === 'remove').map((c) => c.id);
      if (removedIds.length > 0) storeRemoveEdges(removedIds);
    },
    [onEdgesChange, storeRemoveEdges],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node<BrainNodeData>) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<BrainNodeData>) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick],
  );

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setEditingEdge({ id: edge.id, label: String(edge.label ?? ''), x: event.clientX, y: event.clientY });
    },
    [],
  );

  const saveEdgeLabel = useCallback(() => {
    if (!editingEdge) return;
    storeUpdateEdge(editingEdge.id, { label: editingEdge.label || undefined });
    setEditingEdge(null);
  }, [editingEdge, storeUpdateEdge]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onNodeClick={handleNodeClick}
        onPaneClick={onPaneClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        nodesDraggable={layoutMode !== 'auto'}
        className={layoutMode === 'auto' ? 'layout-auto' : undefined}
        minZoom={0.05}
        fitView
      >
        <Background />
        <Controls />
        <FitViewTrigger target={focusTarget} />
      </ReactFlow>

      {editingEdge && (
        <div
          className="edge-label-editor"
          style={{ left: editingEdge.x, top: editingEdge.y }}
        >
          <input
            autoFocus
            value={editingEdge.label}
            onChange={(e) =>
              setEditingEdge((prev) => (prev ? { ...prev, label: e.target.value } : null))
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdgeLabel();
              if (e.key === 'Escape') { edgeEditCancelled.current = true; setEditingEdge(null); }
            }}
            onBlur={() => {
              if (edgeEditCancelled.current) { edgeEditCancelled.current = false; return; }
              saveEdgeLabel();
            }}
            placeholder="Edge label…"
          />
        </div>
      )}
    </div>
  );
}
