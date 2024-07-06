/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import { NodeData, handleSources, handleTargets } from './DenoiseNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { Separator } from './items/Separator';

export function DenoiseNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="DenoiseNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
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
    </NodeBasic>
  );
}
