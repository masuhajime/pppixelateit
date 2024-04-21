/* eslint-disable import/prefer-default-export */
// @flow
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import NodeItemConfig from './NodeItemConfig';

type Props = {
  label: string;
  handleId: string;
  nodeId: string;
};
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
      <Typography variant="h6">{label}</Typography>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        style={NodeItemConfig.handleStyleBordered(
          'OrangeRed',
          handlePositionTop,
          'right',
        )}
      />
    </Box>
  );
}
