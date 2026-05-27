import { memo } from 'react';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { BrainNodeData } from '../../types/graph';
import MiniNodeBody from './MiniNodeBody';
import { useLOD } from './useLOD';

type DocumentNodeType = Node<BrainNodeData, 'document'>;

function DocumentNode({ data, selected, isConnectable }: NodeProps<DocumentNodeType>) {
  const mini = useLOD();
  return (
    <>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {mini ? <MiniNodeBody color="var(--node-document-icon)" selected={selected} /> : (
        <div className={`brain-node brain-node--document${selected ? ' selected' : ''}`}>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
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

export default memo(DocumentNode);
