/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import { NodeData, handleTargets } from './SaveImageNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetDirectory } from './items/HandleTargetDirectory';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetText } from './items/HandleTargetText';
import { Separator } from './items/Separator';
import { Box, Typography } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

export function SaveImageNode({ id, data, selected }: NodeProps<NodeData>) {
  const dir = data.directory || data.settings.directory || '';
  const file = data.filename || data.settings.filename;
  return (
    <NodeBasic
      id={id}
      nodeName="SaveImageNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
      {!!data.errorMessage && (
        <Box sx={{ px: 2, whiteSpace: 'pre-line' }}>
          <Typography variant="body2" color="error.light">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <ErrorIcon color="error" />
              {data.errorMessage}
            </Box>
          </Typography>
          <Typography
            variant="body2"
            color="error.light"
            sx={{
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
            }}
          >
            {data.directory}
          </Typography>
        </Box>
      )}
      <HandleTargetDirectory
        directory={dir}
        placeholder="Select Directory"
        handleId={handleTargets.directory.id}
        nodeId={id}
        onChange={(value) => {
          useNodeStore.getState().updateNodeData<NodeData>(id, {
            directory: value,
          });
        }}
        name="directory"
      />
      <HandleTargetText
        name="file name"
        handleId={handleTargets.filename.id}
        nodeId={id}
        // defaultValue={file || ''}
        value={file || ''}
        onChange={(value) => {
          useNodeStore.getState().updateNodeData<NodeData>(id, {
            filename: value,
          });
        }}
      />
      <Separator />
      <NodeStatus nodeData={data} />
    </NodeBasic>
  );
}
