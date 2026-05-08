import { useCallback } from 'react';
import GraphCanvas from './graph/GraphCanvas';
import { useGraphStore } from './store/graphStore';
import type { NodeType } from './types/graph';

const NODE_TYPES: NodeType[] = ['document', 'topic', 'tag', 'person', 'memory', 'message'];

let cycleIndex = 0;
const typeCounters: Record<string, number> = {};

function App() {
  const addNode = useGraphStore((s) => s.addNode);

  const handleAddNode = useCallback(() => {
    const type = NODE_TYPES[cycleIndex % NODE_TYPES.length];
    cycleIndex += 1;
    typeCounters[type] = (typeCounters[type] ?? 0) + 1;
    const n = typeCounters[type];
    const totalNodes = cycleIndex;
    addNode({
      id: `node-${totalNodes}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${n}`,
      content:
        type === 'document'
          ? 'Sample document content that demonstrates the two-line preview capability of document nodes.'
          : '',
      tags: [],
      createdAt: Date.now(),
      position: { x: 80 + ((totalNodes - 1) * 220) % 660, y: 80 + Math.floor((totalNodes - 1) / 3) * 160 },
    });
  }, [addNode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GraphCanvas />
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button onClick={handleAddNode} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          Add Node
        </button>
      </div>
    </div>
  );
}

export default App;
