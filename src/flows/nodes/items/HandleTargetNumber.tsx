/* eslint-disable import/prefer-default-export */
// @flow
import { Box, TextField } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import NodeItemConfig from './NodeItemConfig';

type Props = {
  name: string;
  handleId: string;
  nodeId: string;
  defaultValue: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};
const handleSize = 20;
export function HandleTargetNumber(props: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    props.onChange && props.onChange(props.defaultValue);
    setHandlePositionTop(ref.current.offsetTop + 28);
  }, [ref.current?.offsetTop]);
  React.useEffect(() => {
    updateNodeInternals(props.nodeId);
  }, [handlePositionTop]);

  return (
    <Box className="node-item" ref={ref}>
      <TextField
        label={props.name}
        type="number"
        InputLabelProps={{
          shrink: true,
        }}
        defaultValue={props.defaultValue}
        variant="outlined"
        className="nodrag"
        size="small"
        sx={{ width: '100%' }}
        onChange={(e) => {
          props.onChange &&
            parseInt(e.target.value) &&
            props.onChange(parseInt(e.target.value));
        }}
        InputProps={{
          inputProps: { type: 'number', min: props.min, max: props.max },
        }}
      />
      {handlePositionTop && (
        <Handle
          type="target"
          position={Position.Left}
          id={props.handleId}
          style={NodeItemConfig.handleStyleBordered(
            'White',
            handlePositionTop,
            'left',
          )}
        />
      )}
    </Box>
  );
}
