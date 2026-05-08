import { useViewport } from '@xyflow/react';

export const LOD_THRESHOLD = 0.6;

export function useLOD(): boolean {
  const { zoom } = useViewport();
  return zoom < LOD_THRESHOLD;
}
