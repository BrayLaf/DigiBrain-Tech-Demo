import SearchBar from './graph/SearchBar';
import type { BrainNode } from './types/graph';
import './AppHeader.css';

const LockIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

interface AppHeaderProps {
  nodes: BrainNode[];
  searchQuery: string;
  onQueryChange: (q: string) => void;
  onFocusNode: (id: string) => void;
  layoutMode: 'free' | 'auto';
  onLayoutToggle: () => void;
  onAddNode: () => void;
  onFitView: () => void;
  onLoadScenarios: () => void;
  onResetDemo: () => void;
}

export default function AppHeader({
  nodes,
  searchQuery,
  onQueryChange,
  onFocusNode,
  layoutMode,
  onLayoutToggle,
  onAddNode,
  onFitView,
  onLoadScenarios,
  onResetDemo,
}: AppHeaderProps) {
  return (
    <header className="app-header">
      {/* ── Brand ── */}
      <div className="app-header__brand">
        <span className="app-header__name">DigiBrain</span>
        <span className="app-header__sub">Tech Demo</span>
      </div>

      {/* ── Toolbar (desktop: inline; mobile: second row) ── */}
      <div className="app-header__toolbar" role="toolbar" aria-label="Graph controls">
        {/* Search — hidden on mobile (floating overlay used instead) */}
        <div className="app-header__search">
          <SearchBar
            nodes={nodes}
            query={searchQuery}
            onQueryChange={onQueryChange}
            onFocusNode={onFocusNode}
          />
        </div>

        <div className="app-header__divider" aria-hidden="true" />

        <div className="layout-toggle" role="group" aria-label="Layout mode">
          <button
            className={`layout-toggle__btn${layoutMode === 'free' ? ' layout-toggle__btn--active' : ''}`}
            onClick={onLayoutToggle}
            disabled={layoutMode === 'free'}
            aria-pressed={layoutMode === 'free'}
          >
            Free
          </button>
          <button
            className={`layout-toggle__btn${layoutMode === 'auto' ? ' layout-toggle__btn--active' : ''}`}
            onClick={onLayoutToggle}
            disabled={layoutMode === 'auto'}
            aria-pressed={layoutMode === 'auto'}
          >
            Auto
          </button>
        </div>

        <div className="app-header__divider" aria-hidden="true" />

        <button className="toolbar-btn toolbar-btn--primary" onClick={onAddNode}>
          Add Node
        </button>
        <button className="toolbar-btn" onClick={onFitView} title="Fit all nodes into view">
          Fit View
        </button>
        <button className="toolbar-btn" onClick={onLoadScenarios}>
          Scenarios
        </button>
        <button className="toolbar-btn toolbar-btn--danger" onClick={onResetDemo}>
          Reset
        </button>
      </div>

      {/* ── Right meta ── */}
      <div className="app-header__meta">
        <div className="app-header__privacy">
          <LockIcon />
          <span>Nothing leaves the browser</span>
        </div>
        <div className="app-header__team">
          <span className="app-header__team-label">Dev:</span>
          <a
            className="app-header__link"
            href="https://www.braydonlafleur.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Braydon
          </a>
          <a
            className="app-header__link"
            href="https://www.shogohardy.site/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shogo
          </a>
        </div>
      </div>
    </header>
  );
}
