import { useCallback } from 'react';
import GraphCanvas from './graph/GraphCanvas';
import { useGraphStore } from './store/graphStore';

let nodeCount = 0;

function App() {
  const addNode = useGraphStore((s) => s.addNode);

  const handleAddNode = useCallback(() => {
    nodeCount += 1;
    addNode({
      id: `node-${nodeCount}`,
      type: 'topic',
      title: `Node ${nodeCount}`,
      content: '',
      tags: [],
      createdAt: Date.now(),
      position: { x: 80 + ((nodeCount - 1) * 180) % 540, y: 80 + Math.floor((nodeCount - 1) / 3) * 120 },
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
