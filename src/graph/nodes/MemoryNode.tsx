import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNodeData } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';

type MemoryNodeType = Node<BrainNodeData, 'memory'>;

function MemoryNode({ data, selected, isConnectable }: NodeProps<MemoryNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-memory-icon)" selected={selected} /> : (
      <div className={`brain-node brain-node--memory${selected ? ' selected' : ''}`}>
        <div className="brain-node__header">
          <span className="brain-node__icon">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
              <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
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

export default memo(MemoryNode);
