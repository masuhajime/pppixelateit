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

HandleTargetText.defaultProps = {
  disableInput: false,
  required: false,
  value: '',
  onChange: () => {},
};
export function HandleTargetText(props: Props) {
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

  const [text, setText] = React.useState('');
  React.useEffect(() => {
    setText(props.value);
  }, [props.value]);
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
            props.onChange && props.onChange(e.target.value);
          }
        }}
        disabled={props.disableInput || connected}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={props.handleId}
        style={
          props.required
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
