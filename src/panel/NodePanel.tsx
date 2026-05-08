import { useEffect, useRef, useState } from 'react';
import { useGraphStore } from '../store/graphStore';
import type { NodeType } from '../types/graph';
import './NodePanel.css';

const TYPE_OPTIONS: { value: NodeType; label: string }[] = [
  { value: 'document', label: 'Document' },
  { value: 'topic', label: 'Topic' },
  { value: 'tag', label: 'Tag' },
  { value: 'person', label: 'Person' },
  { value: 'memory', label: 'Memory' },
  { value: 'message', label: 'Message' },
];

// Always reads fresh store state so sequential calls within one save see each other's nodes.
function resolveOrCreate(
  type: NodeType,
  titleVal: string,
  pos: { x: number; y: number }
): string {
  const { nodes, addNode } = useGraphStore.getState();
  // search current nodes for a match on type + title (case-insensitive)
  const existing = nodes.find(
    (n) => n.type === type && n.title.toLowerCase() === titleVal.toLowerCase(),
  );
  //if we find one, return its id, otherwise create a new one and return the new id
  if (existing) return existing.id;
  const id = crypto.randomUUID();
  addNode({ id, type, title: titleVal, content: '', tags: [], createdAt: Date.now(), position: pos });
  return id;
}

interface NodePanelProps {
  mode: 'create' | 'edit';
  nodeId?: string;
  onClose: () => void;
}

export default function NodePanel({ mode, nodeId, onClose }: NodePanelProps) {
  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const updateNode = useGraphStore((s) => s.updateNode);
  const removeNode = useGraphStore((s) => s.removeNode);
  const addEdge = useGraphStore((s) => s.addEdge);
  const removeEdge = useGraphStore((s) => s.removeEdge);

  const editNode = mode === 'edit' ? nodes.find((n) => n.id === nodeId) : undefined;

  // if editing, try to get the connected person and topic and prefill those fields.
  const derivedPerson = (() => {
    if (!nodeId) return '';
    const e = edges.find(
      (e) => e.target === nodeId && nodes.find((n) => n.id === e.source && n.type === 'person'),
    );
    return e ? (nodes.find((n) => n.id === e.source)?.title ?? '') : '';
  })();

  const derivedTopic = (() => {
    if (!nodeId) return '';
    const e = edges.find(
      (e) => e.target === nodeId && nodes.find((n) => n.id === e.source && n.type === 'topic'),
    );
    return e ? (nodes.find((n) => n.id === e.source)?.title ?? '') : '';
  })();

  const [title, setTitle] = useState(editNode?.title ?? '');
  const [person, setPerson] = useState(derivedPerson);
  const [type, setType] = useState<NodeType>(editNode?.type ?? 'document');
  const [topic, setTopic] = useState(derivedTopic);
  const [content, setContent] = useState(editNode?.content ?? '');
  const [tags, setTags] = useState((editNode?.tags ?? []).join(', '));
  const [titleError, setTitleError] = useState(false);
  // personError only applies to create mode — in edit mode the node already has its parent relationship.
  const [personError, setPersonError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { titleRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleSave() {
    if (!title.trim()) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }

    // Person is required on create — the node must belong to someone from the start.
    if (mode === 'create' && !person.trim()) {
      setPersonError(true);
      return;
    }

    // Deduplicate via Set so "work, work" doesn't produce two edges to the same tag node.
    const tagList = [...new Set(tags.split(',').map((t) => t.trim()).filter(Boolean))];

    if (mode === 'create') {
      const pos = { x: 120 + Math.random() * 500, y: 120 + Math.random() * 400 };
      const newId = crypto.randomUUID();

      useGraphStore.getState().addNode({
        id: newId,
        type,
        title: title.trim(),
        content,
        tags: tagList,
        createdAt: Date.now(),
        position: pos,
      });

      // Resolve or create person/topic nodes, reuses existing ones to avoid duplicates, and checks if the topic already belongs to the person before wiring edges.
      const personId = person.trim()
        ? resolveOrCreate('person', person.trim(), { x: pos.x, y: pos.y - 220 })
        : null;
      const topicId = topic.trim()
        ? resolveOrCreate('topic', topic.trim(), { x: pos.x + 280, y: pos.y - 120 })
        : null;

      // Auto-link person→topic if the topic has no existing person parent, establishing
      // the hierarchy so the node can connect through the topic alone.
      if (personId && topicId) {
        const topicHasParent = useGraphStore.getState().edges.some(
          (e) => e.target === topicId &&
            useGraphStore.getState().nodes.find((n) => n.id === e.source && n.type === 'person'),
        );
        if (!topicHasParent) {
          addEdge({ id: crypto.randomUUID(), source: personId, target: topicId });
        }
      }

      if (topicId) {
        addEdge({ id: crypto.randomUUID(), source: topicId, target: newId });
      }
      if (personId) {
        // Skip person→node when the topic is already under that person — connecting via topic is enough.
        const topicUnderPerson = topicId && useGraphStore.getState().edges.some(
          (e) => e.source === personId && e.target === topicId,
        );
        if (!topicUnderPerson) {
          addEdge({ id: crypto.randomUUID(), source: personId, target: newId });
        }
      }

      tagList.forEach((tag, i) => {
        const tagId = resolveOrCreate('tag', tag, { x: pos.x - 180 + i * 140, y: pos.y + 160 });
        addEdge({ id: crypto.randomUUID(), source: newId, target: tagId });
      });
    } else if (mode === 'edit' && nodeId && editNode) {
      const pos = editNode.position;

      updateNode(nodeId, { title: title.trim(), type, content, tags: tagList });

      // Resolve new person/topic nodes first so we can check their relationship.
      const newPersonId = person.trim()
        ? resolveOrCreate('person', person.trim(), { x: pos.x, y: pos.y - 220 })
        : null;
      const newTopicId = topic.trim()
        ? resolveOrCreate('topic', topic.trim(), { x: pos.x + 280, y: pos.y - 120 })
        : null;

      // Auto-link person→topic if the topic has no existing person parent — same as create mode.
      if (newPersonId && newTopicId) {
        const topicHasParent = useGraphStore.getState().edges.some(
          (e) => e.target === newTopicId &&
            useGraphStore.getState().nodes.find((n) => n.id === e.source && n.type === 'person'),
        );
        if (!topicHasParent) {
          addEdge({ id: crypto.randomUUID(), source: newPersonId, target: newTopicId });
        }
      }

      // Check after the potential auto-link above so a newly parented topic is recognised.
      const topicUnderPerson = !!(newPersonId && newTopicId &&
        useGraphStore.getState().edges.some(
          (e) => e.source === newPersonId && e.target === newTopicId,
        )
      );

      // Person reconciliation
      const oldPersonEdge = edges.find(
        (e) => e.target === nodeId && nodes.find((n) => n.id === e.source && n.type === 'person'),
      );
      const oldPersonTitle = oldPersonEdge
        ? (nodes.find((n) => n.id === oldPersonEdge.source)?.title ?? '')
        : '';
      if (topicUnderPerson) {
        // Topic already implies this person — remove any direct person→node edge.
        if (oldPersonEdge) removeEdge(oldPersonEdge.id);
      } else if (person.trim() !== oldPersonTitle) {
        if (oldPersonEdge) removeEdge(oldPersonEdge.id);
        if (newPersonId) addEdge({ id: crypto.randomUUID(), source: newPersonId, target: nodeId });
      }

      // Topic reconciliation
      const oldTopicEdge = edges.find(
        (e) => e.target === nodeId && nodes.find((n) => n.id === e.source && n.type === 'topic'),
      );
      const oldTopicTitle = oldTopicEdge
        ? (nodes.find((n) => n.id === oldTopicEdge.source)?.title ?? '')
        : '';
      if (topic.trim() !== oldTopicTitle) {
        if (oldTopicEdge) removeEdge(oldTopicEdge.id);
        if (newTopicId) addEdge({ id: crypto.randomUUID(), source: newTopicId, target: nodeId });
      }

      // Tag reconciliation
      const oldTagEdges = edges.filter(
        (e) => e.source === nodeId && nodes.find((n) => n.id === e.target && n.type === 'tag'),
      );
      const oldTagTitles = oldTagEdges.map((e) => nodes.find((n) => n.id === e.target)?.title ?? '');

      oldTagEdges.forEach((e) => {
        const t = nodes.find((n) => n.id === e.target)?.title ?? '';
        if (!tagList.includes(t)) removeEdge(e.id);
      });
      tagList.forEach((tag, i) => {
        if (!oldTagTitles.includes(tag)) {
          const tagId = resolveOrCreate('tag', tag, { x: pos.x - 180 + i * 140, y: pos.y + 160 });
          addEdge({ id: crypto.randomUUID(), source: nodeId, target: tagId });
        }
      });
    }

    onClose();
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    if (nodeId) removeNode(nodeId);
    onClose();
  }

  return (
    <div className="node-panel" role="dialog" aria-modal="true" aria-labelledby="node-panel-title">
      <div className="node-panel__header">
        <h2 id="node-panel-title" className="node-panel__title">{mode === 'create' ? 'Add Node' : 'Edit Node'}</h2>
        <button className="node-panel__close" onClick={onClose} aria-label="Close panel">✕</button>
      </div>

      <div className="node-panel__body">
        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-title">Title *</label>
          <input
            ref={titleRef}
            id="np-title"
            className={`node-panel__input${titleError ? ' node-panel__input--error' : ''}`}
            value={title}
            onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
            placeholder="Node title"
          />
          {titleError && <span className="node-panel__error-msg">Title is required</span>}
        </div>

        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-person">
            Person {mode === 'create' ? '*' : <span className="node-panel__optional">(optional)</span>}
          </label>
          <input
            id="np-person"
            className={`node-panel__input${personError ? ' node-panel__input--error' : ''}`}
            value={person}
            onChange={(e) => { setPerson(e.target.value); setPersonError(false); }}
            placeholder="e.g. John"
          />
          {personError && <span className="node-panel__error-msg">Person is required</span>}
        </div>

        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-type">Type *</label>
          <select
            id="np-type"
            className="node-panel__select"
            value={type}
            onChange={(e) => setType(e.target.value as NodeType)}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-topic">
            Topic <span className="node-panel__optional">(optional)</span>
          </label>
          <input
            id="np-topic"
            className="node-panel__input"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Connect to an existing topic or create one"
          />
        </div>

        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-content">
            Content <span className="node-panel__optional">(optional)</span>
          </label>
          <textarea
            id="np-content"
            className="node-panel__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Node content..."
            rows={4}
          />
        </div>

        <div className="node-panel__field">
          <label className="node-panel__label" htmlFor="np-tags">
            Tags <span className="node-panel__optional">(optional, comma-separated)</span>
          </label>
          <input
            id="np-tags"
            className="node-panel__input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. work, idea, project"
          />
        </div>
      </div>

      <div className="node-panel__footer">
        <div>
          {mode === 'edit' && (
            <button
              className={`node-panel__btn node-panel__btn--danger${confirmDelete ? ' node-panel__btn--confirming' : ''}`}
              onClick={handleDelete}
            >
              {confirmDelete ? 'Confirm?' : 'Delete'}
            </button>
          )}
        </div>
        <div className="node-panel__footer-actions">
          <button className="node-panel__btn node-panel__btn--ghost" onClick={onClose}>Cancel</button>
          <button className="node-panel__btn node-panel__btn--primary" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
