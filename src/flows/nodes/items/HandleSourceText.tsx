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
  propagateValue?: string;
};
const handleSize = 20;
export function HandleSourceText(props: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState<
    number | undefined
  >(undefined);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    setHandlePositionTop(ref.current.offsetTop + ref.current.offsetHeight / 2);
  }, [ref.current?.offsetTop]);
  React.useEffect(() => {
    updateNodeInternals(props.nodeId);
  }, [handlePositionTop]);

  return (
    <Box className="node-item">
      <Typography
        variant="h6"
        sx={{ display: 'flex', justifyContent: 'end' }}
        ref={ref}
      >
        {props.label}
      </Typography>
      <Handle
        type="source"
        position={Position.Right}
        id={props.handleId}
        style={NodeItemConfig.handleStyleBordered(
          'lime',
          handlePositionTop,
          'right',
        )}
      />
      <Box>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          {props.propagateValue || '(No value)'}
        </Typography>
      </Box>
    </Box>
  );
}
