/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { Box, TextField } from '@mui/material';
import useNodeStore from '../../store/store';
import { NodeData, handleSources } from './NumberNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceNumber } from './items/HandleSourceNumber';

export function NumberNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="NumberNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
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
    </NodeBasic>
  );
}
