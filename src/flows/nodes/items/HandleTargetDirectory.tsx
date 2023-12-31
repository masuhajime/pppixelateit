/* eslint-disable import/prefer-default-export */
// @flow
import FolderIcon from '@mui/icons-material/Folder';
import { Box, Button } from '@mui/material';
// import { open } from '@tauri-apps/api/dialog'
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

type Props = {
  name: string;
  handleId: string;
  nodeId: string;
  directory?: string;
  placeholder: string;
  disabled?: boolean;
  onChange?: (value?: string) => void;
};
const handleSize = 20;
export function HandleTargetDirectory(props: Props) {
  const { name, handleId, nodeId, placeholder, directory, disabled, onChange } =
    props;
  const ref = React.useRef<HTMLDivElement>(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [handlePositionTop, setHandlePositionTop] = React.useState(0);
  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    props.onChange && props.onChange(props.directory);
    setHandlePositionTop(ref.current.offsetTop + 28);
  }, [ref.current?.offsetTop]);
  React.useEffect(() => {
    updateNodeInternals(props.nodeId);
  }, [handlePositionTop]);

  return (
    <Box className="node-item" ref={ref}>
      <Button
        className="nodrag"
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'left',
          textTransform: 'none',
        }}
        onClick={async () => {
          const selected = await window.dialog.selectFile({
            buttonLabel: 'Select Directory',
            properties: ['openDirectory'],
            filters: [],
          });
          if (onChange) {
            if (selected) onChange(selected);
            else onChange(undefined);
          }
        }}
      >
        <FolderIcon
          sx={{
            marginRight: '8px',
          }}
        />
        <Box
          sx={{
            // ellipsis
            display: 'inline-block',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            // direction: 'rtl',
            // textAlign: 'left',
          }}
        >
          {props.directory ? props.directory : props.placeholder}
        </Box>
      </Button>
      {handlePositionTop && (
        <Handle
          type="target"
          position={Position.Left}
          id={props.handleId}
          style={{
            background: 'Violet',
            width: handleSize,
            height: handleSize,
            left: -handleSize / 2,
            top: handlePositionTop,
          }}
        />
      )}
    </Box>
  );
}
