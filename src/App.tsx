import { useState } from 'react';
import GraphCanvas from './graph/GraphCanvas';
import NodePanel from './panel/NodePanel';
import MiniPanel from './panel/MiniPanel';

type EditPanel =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; nodeId: string };

function App() {
  const [detailNodeId, setDetailNodeId] = useState<string | null>(null);
  const [editPanel, setEditPanel] = useState<EditPanel>({ open: false });

  function openEdit(nodeId: string) {
    setDetailNodeId(null);
    setEditPanel({ open: true, mode: 'edit', nodeId });
  }

  function closeAll() {
    setDetailNodeId(null);
    setEditPanel({ open: false });
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <GraphCanvas
        onNodeClick={(id) => { setEditPanel({ open: false }); setDetailNodeId(id); }}
        onPaneClick={closeAll}
      />
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={() => { setDetailNodeId(null); setEditPanel({ open: true, mode: 'create' }); }}
          style={{ padding: '6px 14px', cursor: 'pointer' }}
        >
          Add Node
        </button>
      </div>

      {detailNodeId && (
        <MiniPanel
          key={detailNodeId}
          nodeId={detailNodeId}
          onClose={() => setDetailNodeId(null)}
          onEdit={openEdit}
          onSelectNode={(id) => setDetailNodeId(id)}
        />
      )}

      {editPanel.open && (
        <NodePanel
          key={editPanel.mode === 'edit' ? editPanel.nodeId : 'create'}
          mode={editPanel.mode}
          nodeId={editPanel.mode === 'edit' ? editPanel.nodeId : undefined}
          onClose={() => setEditPanel({ open: false })}
        />
      )}
    </div>
  );
}

export default App;
