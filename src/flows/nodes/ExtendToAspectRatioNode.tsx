/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { Box, MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ExtendToAspectRatioNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetNumber } from './items/HandleTargetNumber';
import { Select } from './items/Select';

export function ExtendToAspectRatioNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="ExtendToAspectRatioNode" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Box className="node-item">
          Target Aspect Ratio: {data.settings.width}:{data.settings.height}
        </Box>
        <HandleTargetNumber
          name="width"
          handleId={handleTargets.width.id}
          nodeId={id}
          number={data.settings.width || 1}
          disableHandle
          onChange={(value) => {
            let width = 1;
            if (value > 0) {
              width = value;
            }
            useNodeStore.getState().updateNodeSetting(id, {
              width,
            });
          }}
        />
        <HandleTargetNumber
          name="height"
          handleId={handleTargets.height.id}
          nodeId={id}
          number={data.settings.height || 1}
          disableHandle
          onChange={(value) => {
            let height = 1;
            if (value > 0) {
              height = value;
            }
            useNodeStore.getState().updateNodeSetting(id, {
              height,
            });
          }}
        />
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        />
        <NodeStatus nodeData={data} />
        <ImagePreview
          enabled={data.settings.enablePreview}
          completed={!!data.completed}
          imageBuffer={data.imageBuffer?.buffer}
          onTogglePreview={(enabled: boolean) => {
            useNodeStore.getState().updateNodeSetting(id, {
              enablePreview: enabled,
            });
          }}
        />
      </NodeContent>
    </Node>
  );
}
