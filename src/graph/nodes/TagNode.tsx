import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNode } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';
import './nodes.css';

type TagNodeType = Node<BrainNode, 'tag'>;

export default function TagNode({ data, selected, isConnectable }: NodeProps<TagNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-tag-icon)" selected={selected} /> : (
        <div className={`brain-node brain-node--tag${selected ? ' selected' : ''}`}>
          <span className="brain-node__icon">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </span>
          <span className="brain-node__title">{data.title}</span>
        </div>
      )}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
    </>
  );
}
