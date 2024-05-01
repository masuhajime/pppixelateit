/* eslint-disable import/prefer-default-export */
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';
import { shallow } from 'zustand/shallow';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useMemo, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useNodeStore, { RFState } from '../../store/store';

type CustomEdgeData = {
  label?: string;
  onDelete: (id: string) => void;
};
export function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  data,
  selected,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { edgeDelete } = useNodeStore(
    (state: RFState) => ({
      edgeDelete: state.edgeDelete,
    }),
    shallow,
  );

  const { initialized } = useNodeStore(
    useShallow((state) => ({ initialized: state.initialized })),
  );

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={
          selected
            ? {
                stroke: '#ffcc00',
                strokeDashoffset: '10',
                strokeDasharray: '10',
                strokeOpacity: 0.3,
                strokeWidth: 3,
              }
            : {
                strokeWidth: initialized ? 1 : 0,
              }
        }
      />
      <EdgeLabelRenderer>
        {selected && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <HighlightOffIcon
              style={{
                fontSize: 64,
                color: '#ffcc00',
                cursor: 'pointer',
              }}
              onClick={() => {
                edgeDelete(id);
              }}
            />
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
