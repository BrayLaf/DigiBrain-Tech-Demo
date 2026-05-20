import { useEffect, useRef, useState } from 'react';
import type { BrainNode } from '../types/graph';
import './SearchBar.css';

interface SearchBarProps {
  nodes: BrainNode[];
  query: string;
  onQueryChange: (q: string) => void;
  onFocusNode: (id: string) => void;
}

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchBar({ nodes, query, onQueryChange, onFocusNode }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = q
    ? nodes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
    : [];

  // Cmd/Ctrl+K focuses the search input from anywhere in the app.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function handleResultClick(id: string) {
    onFocusNode(id);
    setOpen(false);
  }

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        <span className="search-bar__icon">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          className="search-bar__input"
          type="text"
          placeholder="Search nodes… (⌘K)"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {query && (
          <button
            className="search-bar__clear"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {open && q && (
        <div className="search-bar__dropdown">
          <p className="search-bar__count">
            {matches.length > 0
              ? `${matches.length} of ${nodes.length} node${nodes.length === 1 ? '' : 's'} matched`
              : 'No nodes matched'}
          </p>
          {matches.map((n) => (
            <button
              key={n.id}
              className="search-bar__result"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleResultClick(n.id)}
            >
              <span className="search-bar__result-title">{n.title}</span>
              <span className="search-bar__result-type">{n.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
