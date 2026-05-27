import type { CSSProperties } from 'react';
import './OnboardingTooltip.css';

const STEPS: { text: string; position: CSSProperties }[] = [
  {
    text: "This is your Digital Brain — a graph of your knowledge",
    position: { bottom: '100px', left: '50%', transform: 'translateX(-50%)' },
  },
  {
    text: "Click any node to view its full content",
    position: { top: '42%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
  {
    text: "Drag between node handles to create a connection",
    position: { top: '60%', left: '50%', transform: 'translate(-50%, -50%)' },
  },
  {
    text: "Use the toolbar to search, auto-layout, or export your brain",
    position: { top: 'calc(var(--header-h) + 60px)', left: '16px' },
  },
];

interface OnboardingTooltipProps {
  step: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingTooltip({ step, onNext, onSkip }: OnboardingTooltipProps) {
  const currentStep = STEPS[step];
  if (!currentStep) return null;
  const { text, position } = currentStep;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="ob-tooltip" style={position} role="status" aria-live="polite">
      <p className="ob-tooltip__text">{text}</p>
      <div className="ob-tooltip__footer">
        <span className="ob-tooltip__step">{step + 1} of {STEPS.length}</span>
        <div className="ob-tooltip__actions">
          <button className="ob-tooltip__btn ob-tooltip__btn--ghost" onClick={onSkip}>
            Skip
          </button>
          <button className="ob-tooltip__btn ob-tooltip__btn--primary" onClick={isLast ? onSkip : onNext}>
            {isLast ? 'Done' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
