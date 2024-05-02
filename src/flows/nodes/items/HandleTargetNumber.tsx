/* eslint-disable import/prefer-default-export */
// @flow
import { Box, TextField } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import NodeItemConfig from './NodeItemConfig';
import useNodeStore from '../../../store/store';

type Props = {
  name: string;
  handleId: string;
  nodeId: string;
  number?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  disableHandle?: boolean;
};
HandleTargetNumber.defaultProps = {
  disableHandle: false,
};
export function HandleTargetNumber(props: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    props.onChange && props.onChange(props.number || 0);
    setHandlePositionTop(ref.current.offsetTop + ref.current.offsetHeight / 2);
  }, [ref.current?.offsetTop, ref.current?.offsetHeight]);
  React.useEffect(() => {
    updateNodeInternals(props.nodeId);
  }, [handlePositionTop]);

  const [number, setNumber] = React.useState(props.number || 0);
  React.useEffect(() => {
    setNumber(props.number);
  }, [props.number]);

  const [connected, setConnected] = React.useState(false);
  useNodeStore.subscribe((state) => {
    const c = state.getEdgesConnectedToNodeAndHandle(
      props.nodeId,
      props.handleId,
    );
    const isConnected = c.length > 0;
    setConnected(isConnected);
  });

  return (
    <Box className="node-item" ref={ref}>
      <TextField
        label={props.name}
        type={connected ? 'text' : 'number'}
        InputLabelProps={{
          shrink: true,
        }}
        placeholder={connected ? '(Connected)' : undefined}
        value={connected ? '(Connected)' : number}
        variant="outlined"
        className="nodrag"
        size="small"
        sx={{ width: '100%' }}
        onChange={(e) => {
          if (!connected) {
            const n = parseInt(e.target.value, 10);
            setNumber(n);
            if (props.onChange) {
              props.onChange(n);
            }
          }
        }}
        disabled={props.disableInput || connected}
        InputProps={{
          inputProps: { type: 'number', min: props.min, max: props.max },
        }}
      />
      {!props.disableHandle && (
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
