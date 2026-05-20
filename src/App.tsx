import { useState } from 'react';
import AppHeader from './AppHeader';
import GraphCanvas from './graph/GraphCanvas';
import NodePanel from './panel/NodePanel';
import MiniPanel from './panel/MiniPanel';
import SearchBar from './graph/SearchBar';
import { useGraphStore } from './store/graphStore';
import ScenarioPicker from './demo/ScenarioPicker';
import OnboardingTooltip from './onboarding/OnboardingTooltip';
import { allScenarios } from './store/seedData';
import type { Scenario } from './store/seedData';

const ONBOARDING_KEY = 'digibrain_onboarding_done';

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  const nodes = useGraphStore((s) => s.nodes);
  const setGraph = useGraphStore((s) => s.setGraph);

  function openEdit(nodeId: string) {
    setDetailNodeId(null);
    setEditPanel({ open: true, mode: 'edit', nodeId });
  }

  function closeAll() {
    setDetailNodeId(null);
    setEditPanel({ open: false });
  }

  function handleSelectScenario(scenario: Scenario) {
    // Confirmation only from toolbar picker (not welcome), when graph has nodes
    if (!showWelcome && nodes.length > 0) {
      const ok = window.confirm(`Replace the current graph with the "${scenario.name}" scenario?`);
      if (!ok) return;
    }
    setGraph(scenario.nodes, scenario.edges);
    setShowWelcome(false);
    setShowPicker(false);
    closeAll();
    if (!sessionStorage.getItem(ONBOARDING_KEY)) {
      setOnboardingStep(0);
    }
  }

  function handleOnboardingNext() {
    if (onboardingStep === null) return;
    if (onboardingStep >= 3) {
      sessionStorage.setItem(ONBOARDING_KEY, '1');
      setOnboardingStep(null);
    } else {
      setOnboardingStep(onboardingStep + 1);
    }
  }

  function handleOnboardingSkip() {
    sessionStorage.setItem(ONBOARDING_KEY, '1');
    setOnboardingStep(null);
  }

  function handleResetDemo() {
    if (nodes.length > 0) {
      const ok = window.confirm('Reset and clear your current graph?');
      if (!ok) return;
    }
    setGraph([], []);
    sessionStorage.removeItem(ONBOARDING_KEY);
    setShowWelcome(true);
    setShowPicker(false);
    setOnboardingStep(null);
    closeAll();
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
      <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, display: 'flex', gap: 8 }}>
        <button
          onClick={() => { setDetailNodeId(null); setEditPanel({ open: true, mode: 'create' }); }}
          style={{ padding: '6px 14px', cursor: 'pointer' }}
        >
          Add Node
        </button>
        <button
          onClick={() => setShowPicker(true)}
          style={{ padding: '6px 14px', cursor: 'pointer' }}
        >
          Demo scenarios
        </button>
        <button
          onClick={handleResetDemo}
          style={{ padding: '6px 14px', cursor: 'pointer' }}
        >
          Reset demo
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

      {/* Welcome screen — shown on first load, forced pick */}
      {showWelcome && (
        <ScenarioPicker
          scenarios={allScenarios}
          onSelect={handleSelectScenario}
        />
      )}

      {/* Toolbar scenario picker */}
      {!showWelcome && showPicker && (
        <ScenarioPicker
          scenarios={allScenarios}
          onSelect={handleSelectScenario}
          onClose={() => setShowPicker(false)}
        />
      )}

      {/* Onboarding tooltips */}
      {onboardingStep !== null && (
        <OnboardingTooltip
          key={onboardingStep}
          step={onboardingStep}
          onNext={handleOnboardingNext}
          onSkip={handleOnboardingSkip}
        />
      )}
    </div>
  </>
  );
}

export default App;
