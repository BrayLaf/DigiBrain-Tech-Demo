import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNode } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';
import './nodes.css';

type PersonNodeType = Node<BrainNode, 'person'>;

export default function PersonNode({ data, selected, isConnectable }: NodeProps<PersonNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-person-icon)" selected={selected} /> : (
      <div className={`brain-node brain-node--person${selected ? ' selected' : ''}`}>
        <div className="brain-node__header">
          <span className="brain-node__icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <span className="brain-node__title">{data.title}</span>
        </div>
        {data.content && <p className="brain-node__preview">{data.content}</p>}
      </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>
  );
}
