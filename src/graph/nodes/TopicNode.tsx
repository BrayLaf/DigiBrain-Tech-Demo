import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNodeData } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';

type TopicNodeType = Node<BrainNodeData, 'topic'>;

function TopicNode({ data, selected, isConnectable }: NodeProps<TopicNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-topic-icon)" selected={selected} /> : (
        <div className={`brain-node brain-node--topic${selected ? ' selected' : ''}`}>
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
                <circle cx="12" cy="12" r="3" />
                <circle cx="4" cy="6" r="2" />
                <circle cx="20" cy="6" r="2" />
                <circle cx="4" cy="18" r="2" />
                <circle cx="20" cy="18" r="2" />
                <line x1="9.3" y1="10.7" x2="5.7" y2="7.3" />
                <line x1="14.7" y1="10.7" x2="18.3" y2="7.3" />
                <line x1="9.3" y1="13.3" x2="5.7" y2="16.7" />
                <line x1="14.7" y1="13.3" x2="18.3" y2="16.7" />
              </svg>
            </span>
            <span className="brain-node__title">{data.title}</span>
          </div>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </>
  );
}

export default memo(TopicNode);
