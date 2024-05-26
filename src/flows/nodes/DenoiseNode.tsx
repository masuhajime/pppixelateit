/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import { NodeData, handleSources, handleTargets } from './DenoiseNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import { NodeStatus } from './components/NodeStatus';
import { Select } from './items/Select';

export function DenoiseNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Denoise" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        />
        <Select
          label="Pattern"
          nodeId={id}
          defaultValue={data.settings.pattern || 'median_3'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              pattern: value,
            });
          }}
        >
          <MenuItem value="median_3">Median(3)</MenuItem>
          <MenuItem value="median_5">Median(5)</MenuItem>
          <MenuItem value="nearest_color_around">Nearest color around</MenuItem>
        </Select>
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
