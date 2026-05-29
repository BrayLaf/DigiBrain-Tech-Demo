import { useEffect } from 'react';
import type { Scenario } from '../store/seedData';
import './ScenarioPicker.css';

interface ScenarioPickerProps {
  scenarios: Scenario[];
  onSelect: (scenario: Scenario) => void;
  /** Omit for welcome mode — removes close controls and changes the title. */
  onClose?: () => void;
}

export default function ScenarioPicker({ scenarios, onSelect, onClose }: ScenarioPickerProps) {
  const isWelcome = !onClose;

  useEffect(() => {
    if (isWelcome) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isWelcome, onClose]);

  return (
    <div
      className={`sp-backdrop${isWelcome ? ' sp-backdrop--welcome' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sp-title"
    >
      <div className={`sp-panel${isWelcome ? ' sp-panel--welcome' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="sp-header">
          <h2 id="sp-title" className="sp-title">
            {isWelcome ? 'Welcome to Kaika' : 'Demo Scenarios'}
          </h2>
          {!isWelcome && (
            <button className="sp-close" onClick={onClose} aria-label="Close">✕</button>
          )}
        </div>
        <p className="sp-subtitle">
          {isWelcome
            ? 'Choose a starting point for your knowledge graph.'
            : 'Pick a scenario to explore what a Digital Brain can do.'}
        </p>
        <div className="sp-cards">
          {scenarios.map((s) => (
            <button key={s.id} className="sp-card" onClick={() => onSelect(s)}>
              <span className="sp-card__icon" aria-hidden="true">{s.icon}</span>
              <span className="sp-card__name">{s.name}</span>
              <span className="sp-card__desc">{s.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
