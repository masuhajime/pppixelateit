/* eslint-disable import/prefer-default-export */
// @flow
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

type Props = {
  label: string;
  handleId: string;
  nodeId: string;
};
const handleSize = 20;
export function HandleSourceImage(props: Props) {
  const { handleId, label, nodeId } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    setHandlePositionTop(ref.current.offsetTop + 28);
  }, [ref.current?.offsetTop]);
  React.useEffect(() => {
    updateNodeInternals(nodeId);
  }, [handlePositionTop, nodeId, updateNodeInternals]);

  return (
    <Box ref={ref} className="node-item">
      <Typography variant="h6">
        {label} ({handleId})
      </Typography>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        style={{
          background: 'OrangeRed',
          width: handleSize,
          height: handleSize,
          right: -handleSize / 2,
          top: handlePositionTop,
        }}
      />
    </Box>
  );
}
