import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  type Node,
  type Edge,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '../store/graphStore';
import { genId } from '../utils/id';
import type { BrainNode } from '../types/graph';
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

interface GraphCanvasProps {
  onNodeClick?: (nodeId: string) => void;
}

interface EdgeLabelEdit {
  id: string;
  label: string;
  x: number;
  y: number;
}

export default function GraphCanvas({ onNodeClick }: GraphCanvasProps) {
  const brainNodes = useGraphStore((s) => s.nodes);
  const brainEdges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const storeAddEdge = useGraphStore((s) => s.addEdge);
  const storeUpdateEdge = useGraphStore((s) => s.updateEdge);
  const storeRemoveEdges = useGraphStore((s) => s.removeEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BrainNode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [editingEdge, setEditingEdge] = useState<EdgeLabelEdit | null>(null);
  const edgeEditCancelled = useRef(false);

  useEffect(() => {
    setNodes(
      brainNodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: n,
      })),
    );
  }, [brainNodes, setNodes]);

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
    (_event: React.MouseEvent, node: Node<BrainNode>) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode],
  );

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<BrainNode>) => {
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
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.05}
        fitView
      >
        <Background />
        <Controls />
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
