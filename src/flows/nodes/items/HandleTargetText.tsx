/* eslint-disable import/prefer-default-export */
// @flow
import { Box, TextField } from '@mui/material';
import * as React from 'react';
import { Edge, Handle, Position, useUpdateNodeInternals } from 'reactflow';
import NodeItemConfig from './NodeItemConfig';
import useNodeStore from '../../../store/store';

type Props = {
  name: string;
  handleId: string;
  nodeId: string;
  value?: string;
  onChange?: (value: string) => void;
  disableInput?: boolean;
  required?: boolean;
};

export function HandleTargetText({
  name,
  handleId,
  nodeId,
  value = '',
  onChange = () => {},
  disableInput = false,
  required = false,
}: Props) {
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
    updateNodeInternals(nodeId);
  }, [handlePositionTop]);

  const [text, setText] = React.useState('');
  React.useEffect(() => {
    setText(value);
  }, [value]);
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
        type="text"
        InputLabelProps={{
          shrink: true,
        }}
        value={connected ? '(Connected)' : text}
        variant="outlined"
        className="nodrag"
        size="small"
        sx={{ width: '100%' }}
        onChange={(e) => {
          if (!connected) {
            setText(e.target.value);
            onChange && onChange(e.target.value);
          }
        }}
        disabled={disableInput || connected}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={handleId}
        style={
          required
            ? NodeItemConfig.handleStyleFilled(
                'Lime',
                handlePositionTop,
                'left',
              )
            : NodeItemConfig.handleStyleBordered(
                'Lime',
                handlePositionTop,
                'left',
              )
        }
      />
    </Box>
  );
}
