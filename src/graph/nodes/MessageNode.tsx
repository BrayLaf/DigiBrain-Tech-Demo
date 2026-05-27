import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNodeData } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';

type MessageNodeType = Node<BrainNodeData, 'message'>;

function MessageNode({ data, selected, isConnectable }: NodeProps<MessageNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-message-icon)" selected={selected} /> : (
      <div className={`brain-node brain-node--message${selected ? ' selected' : ''}`}>
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

export default memo(MessageNode);
