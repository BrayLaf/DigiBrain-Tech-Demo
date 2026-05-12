import { useState } from 'react';
import AppHeader from './AppHeader';
import GraphCanvas from './graph/GraphCanvas';
import NodePanel from './panel/NodePanel';

type PanelState =
  | { open: false }
  | { open: true; mode: 'create' }
  | { open: true; mode: 'edit'; nodeId: string };

function App() {
  const [panel, setPanel] = useState<PanelState>({ open: false });

  return (
    <>
      <AppHeader />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <GraphCanvas
          onNodeClick={(id) => setPanel({ open: true, mode: 'edit', nodeId: id })}
        />
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <button
            onClick={() => setPanel({ open: true, mode: 'create' })}
            style={{ padding: '6px 14px', cursor: 'pointer' }}
          >
            Add Node
          </button>
        </div>
        {panel.open && (
          <NodePanel
            key={panel.mode === 'edit' ? panel.nodeId : 'create'}
            mode={panel.mode}
            nodeId={panel.mode === 'edit' ? panel.nodeId : undefined}
            onClose={() => setPanel({ open: false })}
          />
        )}
      </div>
    </>
  );
}

export default App;
