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

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__name">DigiBrain</span>
        <span className="app-header__sub">Tech Demo</span>
      </div>
      <div className="app-header__privacy">
        <LockIcon />
        <span>Nothing leaves the browser</span>
      </div>
      <div className="app-header__team">
        <span className="app-header__team-label">Dev team:</span>
        <a
          className="app-header__link"
          href="https://www.braydonlafleur.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Braydon Lafleur
        </a>
        <a
          className="app-header__link"
          href="https://www.shogohardy.site/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Shogo Hardy
        </a>
      </div>
    </header>
  );
}
