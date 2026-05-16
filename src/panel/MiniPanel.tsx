import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useGraphStore } from '../store/graphStore';
import type { NodeType } from '../types/graph';
import './MiniPanel.css';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const TYPE_BADGE: Record<NodeType, string> = {
  document: 'mini-badge--document',
  topic:    'mini-badge--topic',
  tag:      'mini-badge--tag',
  person:   'mini-badge--person',
  memory:   'mini-badge--memory',
  message:  'mini-badge--message',
};

interface MiniPanelProps {
  nodeId: string;
  onClose: () => void;
  onEdit: (nodeId: string) => void;
  onSelectNode: (nodeId: string) => void;
}

export default function MiniPanel({ nodeId, onClose, onEdit, onSelectNode }: MiniPanelProps) {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);

  const node = nodes.find((n) => n.id === nodeId);

  const connectedNodes = edges
    .filter((e) => e.source === nodeId || e.target === nodeId)
    .flatMap((e) => {
      const connectedId = e.source === nodeId ? e.target : e.source;
      const peer = nodes.find((n) => n.id === connectedId);
      return peer ? [{ id: connectedId, title: peer.title, type: peer.type, label: e.label }] : [];
    });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!node) return null;

  return (
    <div className="mini-panel" role="dialog" aria-modal="true" aria-labelledby="mini-panel-title">
      <div className="mini-panel__header">
        <span className={`mini-badge ${TYPE_BADGE[node.type]}`}>{node.type}</span>
        <div className="mini-panel__header-actions">
          <button className="mini-panel__edit-btn" onClick={() => onEdit(nodeId)}>Edit</button>
          <button className="mini-panel__close" onClick={onClose} aria-label="Close panel">✕</button>
        </div>
      </div>

      <div className="mini-panel__body">
        <h1 className="mini-panel__title" id="mini-panel-title">{node.title}</h1>

        {node.tags.length > 0 && (
          <div className="mini-panel__tags">
            {node.tags.map((tag) => (
              <span key={tag} className="mini-tag">{tag}</span>
            ))}
          </div>
        )}

        <time className="mini-panel__date">{formatDate(node.createdAt)}</time>

        {node.content && (
          <div className="mini-panel__content">
            <ReactMarkdown>{node.content}</ReactMarkdown>
          </div>
        )}

        {connectedNodes.length > 0 && (
          <div className="mini-panel__connections">
            <h3 className="mini-panel__connections-title">Connected</h3>
            <ul className="mini-panel__connections-list">
              {connectedNodes.map((cn) => (
                <li key={cn.id}>
                  <button
                    className="mini-panel__connection-link"
                    onClick={() => onSelectNode(cn.id)}
                  >
                    <span className={`mini-dot mini-dot--${cn.type}`} />
                    {cn.title}
                    {cn.label && (
                      <span className="mini-panel__edge-label">{cn.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
