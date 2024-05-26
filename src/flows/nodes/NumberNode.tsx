/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { Box, TextField } from '@mui/material';
import { NodeData, handleSources, handleTargets } from './NumberNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceNumber } from './items/HandleSourceNumber';
import useNodeStore from '../../store/store';

export function NumberNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Number" nodeId={id} />
      <NodeContent>
        <Box className="node-item">
          <TextField
            label="Number"
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            value={data.settings.value || 0}
            variant="outlined"
            className="nodrag"
            size="small"
            sx={{ width: '100%' }}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              useNodeStore.getState().updateNodeSetting(id, {
                value: n,
              });
            }}
          />
        </Box>
        <HandleSourceNumber
          handleId={handleSources.number.id}
          label="Number"
          nodeId={id}
        />
        <NodeStatus nodeData={data} />
      </NodeContent>
    </Node>
  );
}
