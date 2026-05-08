interface MiniNodeBodyProps {
  color: string;
  selected?: boolean;
}

export default function MiniNodeBody({ color, selected }: MiniNodeBodyProps) {
  return (
    <div className="brain-node--mini">
      <svg width="64" height="64" viewBox="-32 -32 64 64" aria-hidden="true">
        <path
          d="M 0 -26 Q 10 -10 26 0 Q 10 10 0 26 Q -10 10 -26 0 Q -10 -10 0 -26 Z"
          fill={color}
          stroke={selected ? 'white' : 'none'}
          strokeWidth={selected ? 1.5 : 0}
        />
      </svg>
    </div>
  );
}
