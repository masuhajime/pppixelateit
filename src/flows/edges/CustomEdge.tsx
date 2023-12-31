/* eslint-disable import/prefer-default-export */
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from 'reactflow';
import { shallow } from 'zustand/shallow';
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

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {selected ? (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#ffcc00',
              padding: 10,
              borderRadius: 5,
              fontSize: 12,
              fontWeight: 700,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
            onClick={() => {
              edgeDelete(id);
            }}
          >
            Delete
          </div>
        ) : (
          <></>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
