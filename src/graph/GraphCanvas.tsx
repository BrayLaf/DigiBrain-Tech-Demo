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

export default function GraphCanvas() {
  const brainNodes = useGraphStore((s) => s.nodes);
  const brainEdges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const addEdge = useGraphStore((s) => s.addEdge);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<{ label: string }>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(
      brainNodes.map((n) => ({
        id: n.id,
        position: n.position,
        data: { label: n.title },
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
    (_event: React.MouseEvent, node: Node<{ label: string }>) => {
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
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
