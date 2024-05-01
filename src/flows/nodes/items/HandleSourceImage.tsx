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

  const [handlePositionTop, setHandlePositionTop] = React.useState<
    number | undefined
  >(undefined);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    props.onChange && props.onChange(props.number || 0);
    setHandlePositionTop(ref.current.offsetTop + ref.current.offsetHeight / 2);
  }, [ref.current?.offsetTop, ref.current?.offsetHeight, props]);

  return (
    <Box
      ref={ref}
      className="node-item"
      sx={{
        display: 'flex',
        flexDirection: 'row-reverse',
      }}
    >
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
