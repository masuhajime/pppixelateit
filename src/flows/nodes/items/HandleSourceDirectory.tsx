/* eslint-disable import/prefer-default-export */
// @flow
import { Box, Button } from '@mui/material';
import * as React from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import FolderIcon from '@mui/icons-material/Folder';
import NodeItemConfig from './NodeItemConfig';
// import { open } from '@tauri-apps/api/dialog'

type Props = {
  label: string;
  handleId: string;
  nodeId: string;
  directory?: string;
  placeholder: string;
  disabled?: boolean;
  onSelect?: (directory: string) => void; // TODO: use this
};
export function HandleSourceDirectory(props: Props) {
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
    <Box ref={ref} className="node-item">
      <Button
        className="nodrag"
        variant="outlined"
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'left',
          textTransform: 'none',
        }}
        disabled={props.disabled}
        onClick={async () => {
          // const selectedDir = await open({
          //   multiple: false,
          //   directory: true,
          //   filters: [],
          // });
          // if (Array.isArray(selectedDir)) {
          //   // user selectedFile multiple files
          //   console.error("can't select multiple files");
          // } else if (selectedDir === null) {
          //   // user cancelled the selection
          //   console.error("can't select file");
          // } else {
          //   props.onSelect && props.onSelect(selectedDir);
          // }
        }}
      >
        <FolderIcon
          sx={{
            marginRight: '8px',
          }}
        />
        <Box
          sx={{
            display: 'inline-block',
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textAlign: 'left',
            direction: 'rtl',
            textAlign: 'right',
          }}
        >
          {props.directory ? props.directory : props.placeholder}
        </Box>
      </Button>

      <Handle
        type="source"
        position={Position.Right}
        id={props.handleId}
        style={NodeItemConfig.handleStyleBordered(
          'Violet',
          handlePositionTop,
          'right',
        )}
      />
    </Box>
  );
}
