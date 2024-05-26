/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './RemoveEdgePixelNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { Separator } from './items/Separator';

export function RemoveEdgePixelNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="RemoveEdge" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Select
          label="Pixel count around"
          nodeId={id}
          defaultValue={data.settings.pixelCount || '3'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              pixelCount: value,
            });
          }}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
        </Select>
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
