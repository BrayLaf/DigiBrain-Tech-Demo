import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGraphStore } from '../store/graphStore';
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

export default function GraphCanvas() {
  const brainNodes = useGraphStore((s) => s.nodes);
  const brainEdges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const addEdge = useGraphStore((s) => s.addEdge);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<BrainNode>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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
      })),
    );
  }, [brainEdges, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge({
        id: crypto.randomUUID(),
        source: connection.source,
        target: connection.target,
      });
    },
    [addEdge],
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node<BrainNode>) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        minZoom={0.05}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
