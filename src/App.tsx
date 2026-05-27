import { useEffect, useRef, useState } from 'react';
import AppHeader from './AppHeader';
import GraphCanvas from './graph/GraphCanvas';
import SearchBar from './graph/SearchBar';
import NodePanel from './panel/NodePanel';
import MiniPanel from './panel/MiniPanel';
import { useGraphStore } from './store/graphStore';
import { applyDagreLayout, graphTopologyKey } from './graph/layout';
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
  const [layoutMode, setLayoutMode] = useState<'free' | 'auto'>('free');
  const [fitAllTrigger, setFitAllTrigger] = useState(0);
  const autoLayoutKeyRef = useRef<string>('');

  const brainNodes = useGraphStore((s) => s.nodes);
  const brainEdges = useGraphStore((s) => s.edges);
  const batchUpdatePositions = useGraphStore((s) => s.batchUpdatePositions);

  function handleFocusNode(id: string) {
    setFocusTarget({ id, ts: Date.now() });
  }

  function handleLayoutToggle() {
    if (layoutMode === 'free') {
      autoLayoutKeyRef.current = '';
      setLayoutMode('auto');
    } else {
      setLayoutMode('free');
    }
  }

  function handleFitView() {
    setFitAllTrigger((n) => n + 1);
  }

  // Re-run dagre whenever graph topology changes in Auto mode.
  useEffect(() => {
    if (layoutMode !== 'auto' || brainNodes.length === 0) return;
    const key = graphTopologyKey(brainNodes, brainEdges);
    if (key === autoLayoutKeyRef.current) return;
    autoLayoutKeyRef.current = key;
    const laid = applyDagreLayout(brainNodes, brainEdges);
    const posMap: Record<string, { x: number; y: number }> = {};
    for (const n of laid) posMap[n.id] = n.position;
    batchUpdatePositions(posMap);
  }, [layoutMode, brainNodes, brainEdges, batchUpdatePositions]);

  const [showWelcome, setShowWelcome] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  const setGraph = useGraphStore((s) => s.setGraph);

  function openEdit(nodeId: string) {
    setDetailNodeId(null);
    setEditPanel({ open: true, mode: 'edit', nodeId });
  }

  function closeAll() {
    setDetailNodeId(null);
    setEditPanel({ open: false });
  }

  function handleAddNode() {
    setDetailNodeId(null);
    setEditPanel({ open: true, mode: 'create' });
  }

  function handleSelectScenario(scenario: Scenario) {
    if (!showWelcome && brainNodes.length > 0) {
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
    if (brainNodes.length > 0) {
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

  function handleLoadScenarios() {
    setShowPicker(true);
  }

  const showEmptyState = brainNodes.length === 0 && !showWelcome && !showPicker;

  return (
    <>
      <AppHeader
        nodes={brainNodes}
        searchQuery={searchQuery}
        onQueryChange={setSearchQuery}
        onFocusNode={handleFocusNode}
        layoutMode={layoutMode}
        onLayoutToggle={handleLayoutToggle}
        onAddNode={handleAddNode}
        onFitView={handleFitView}
        onLoadScenarios={handleLoadScenarios}
        onResetDemo={handleResetDemo}
      />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <GraphCanvas
          onNodeClick={(id) => { setEditPanel({ open: false }); setDetailNodeId(id); }}
          onPaneClick={closeAll}
          searchQuery={searchQuery}
          focusTarget={focusTarget}
          layoutMode={layoutMode}
          fitAllTrigger={fitAllTrigger}
        />

        {/* Mobile: floating search (hidden on desktop via CSS) */}
        <div className="search-overlay">
          <SearchBar
            nodes={brainNodes}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onFocusNode={handleFocusNode}
          />
        </div>

        {/* Empty graph state */}
        {showEmptyState && (
          <div className="empty-state">
            <div className="empty-state__card">
              <div className="empty-state__icon" aria-hidden="true">🧠</div>
              <h2 className="empty-state__title">Your Digital Brain is empty</h2>
              <p className="empty-state__desc">
                Add a node to start building your knowledge graph, or load a demo scenario to explore what's possible.
              </p>
              <div className="empty-state__actions">
                <button className="empty-state__btn empty-state__btn--primary" onClick={handleAddNode}>
                  Add Node
                </button>
                <button className="empty-state__btn empty-state__btn--ghost" onClick={handleLoadScenarios}>
                  Load Demo
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Welcome screen — shown on first load */}
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
