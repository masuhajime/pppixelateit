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
export function HandleTargetNumber({
  name,
  handleId,
  nodeId,
  number,
  min,
  max,
  onChange,
  disableHandle = false,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    onChange && onChange(number || 0);
    setHandlePositionTop(ref.current.offsetTop + ref.current.offsetHeight / 2);
  }, [ref.current?.offsetTop, ref.current?.offsetHeight]);
  React.useEffect(() => {
    updateNodeInternals(nodeId);
  }, [handlePositionTop]);

  const [value, setValue] = React.useState(number || 0);
  React.useEffect(() => {
    setValue(number);
  }, [number]);

  const [connected, setConnected] = React.useState(false);
  useNodeStore.subscribe((state) => {
    const c = state.getEdgesConnectedToNodeAndHandle(nodeId, handleId);
    const isConnected = c.length > 0;
    setConnected(isConnected);
  });

  return (
    <Box className="node-item" ref={ref}>
      <TextField
        label={name}
        type={connected ? 'text' : 'number'}
        InputLabelProps={{
          shrink: true,
        }}
        placeholder={connected ? '(Connected)' : undefined}
        value={connected ? '(Connected)' : value}
        variant="outlined"
        className="nodrag"
        size="small"
        sx={{ width: '100%' }}
        onChange={(e) => {
          if (!connected) {
            const n = parseInt(e.target.value, 10);
            setValue(n);
            if (onChange) {
              onChange(n);
            }
          }
        }}
        disabled={connected}
        InputProps={{
          inputProps: { type: 'number', min, max },
        }}
      />
      {!disableHandle && (
        <Handle
          type="target"
          position={Position.Left}
          id={handleId}
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
