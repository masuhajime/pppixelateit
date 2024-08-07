/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import { NodeData, handleSources, handleTargets } from './ExtendNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetNumber } from './items/HandleTargetNumber';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { Separator } from './items/Separator';

export function ExtendNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="ExtendNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
      <Select
        label="Unit"
        nodeId={id}
        defaultValue={data.settings.unit || 'pixel'}
        onSelect={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            unit: value,
          });
        }}
      >
        <MenuItem value="pixel">pixel</MenuItem>
        <MenuItem value="percent">percent</MenuItem>
      </Select>
      <HandleTargetNumber
        name="top"
        handleId={handleTargets.top.id}
        nodeId={id}
        number={data.settings.top || 10}
        onChange={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            top: value,
          });
        }}
      />
      <HandleTargetNumber
        name="bottom"
        handleId={handleTargets.bottom.id}
        nodeId={id}
        number={data.settings.bottom || 10}
        onChange={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            bottom: value,
          });
        }}
      />
      <HandleTargetNumber
        name="left"
        handleId={handleTargets.left.id}
        nodeId={id}
        number={data.settings.left || 10}
        onChange={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            left: value,
          });
        }}
      />
      <HandleTargetNumber
        name="right"
        handleId={handleTargets.right.id}
        nodeId={id}
        number={data.settings.right || 10}
        onChange={(value) => {
          useNodeStore.getState().updateNodeSetting(id, {
            right: value,
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
    </NodeBasic>
  );
}
