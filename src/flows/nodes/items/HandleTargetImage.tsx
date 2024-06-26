/* eslint-disable import/prefer-default-export */
// @flow
import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import NodeItemConfig from './NodeItemConfig';

type Props = {
  handleId: string;
  nodeId: string;
  label?: string;
};
const handleSize = 24;
export function HandleTargetImage(props: Props) {
  const { handleId, nodeId } = props;
  const ref = React.useRef<HTMLDivElement>(null);

  const updateNodeInternals = useUpdateNodeInternals();
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
  React.useEffect(() => {
    updateNodeInternals(props.nodeId);
  }, [handlePositionTop]);

  return (
    <Box ref={ref} className="node-item">
      <Typography variant="h6">
        {props.label ? props.label : 'Image'}
      </Typography>
      <Handle
        type="target"
        position={Position.Left}
        id={handleId}
        style={NodeItemConfig.handleStyleFilled(
          'OrangeRed',
          handlePositionTop,
          'left',
        )}
      />
    </Box>
  );
}
