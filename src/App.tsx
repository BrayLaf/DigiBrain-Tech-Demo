import { useState } from 'react';
import AppHeader from './AppHeader';
import GraphCanvas from './graph/GraphCanvas';
import NodePanel from './panel/NodePanel';
import MiniPanel from './panel/MiniPanel';
import SearchBar from './graph/SearchBar';
import { useGraphStore } from './store/graphStore';

type EditPanel =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; nodeId: string };

function App() {
  const [detailNodeId, setDetailNodeId] = useState<string | null>(null);
  const [editPanel, setEditPanel] = useState<EditPanel>({ open: false });
  const [searchQuery, setSearchQuery] = useState('');
  const [focusTarget, setFocusTarget] = useState<{ id: string; ts: number } | null>(null);

  const brainNodes = useGraphStore((s) => s.nodes);

  function handleFocusNode(id: string) {
    setFocusTarget({ id, ts: Date.now() });
  }

  function openEdit(nodeId: string) {
    setDetailNodeId(null);
    setEditPanel({ open: true, mode: 'edit', nodeId });
  }

  function closeAll() {
    setDetailNodeId(null);
    setEditPanel({ open: false });
  }

  return (
  <>
    <AppHeader />
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <GraphCanvas
        onNodeClick={(id) => { setEditPanel({ open: false }); setDetailNodeId(id); }}
        onPaneClick={closeAll}
        searchQuery={searchQuery}
        focusTarget={focusTarget}
      />
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
        <button
          onClick={() => { setDetailNodeId(null); setEditPanel({ open: true, mode: 'create' }); }}
          style={{ padding: '6px 14px', cursor: 'pointer' }}
        >
          Add Node
        </button>
      </div>
      <div style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <SearchBar
          nodes={brainNodes}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          onFocusNode={handleFocusNode}
        />
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
    </>
  );
}

export default App;
