/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ResizeToSideNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetNumber } from './items/HandleTargetNumber';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { Separator } from './items/Separator';

export function ResizeToSideNode({ id, data }: NodeProps<NodeData>) {
  const store = useNodeStore.getState();
  const node = store.getNode<NodeData>(id);

  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Resize To Side" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Select
          label="Resize Base"
          nodeId={id}
          defaultValue={data.settings.resizeBase || 'width'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              resizeBase: value,
            });
          }}
        >
          <MenuItem value="width">Width</MenuItem>
          <MenuItem value="height">Height</MenuItem>
          <MenuItem value="shorter">Shorter Side</MenuItem>
          <MenuItem value="longer">Longer Side</MenuItem>
        </Select>
        <HandleTargetNumber
          name="size"
          handleId="size"
          nodeId={id}
          defaultValue={node.data.settings.size || 128}
          onChange={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              size: value,
            });
          }}
        />
        <Select
          label="Method"
          nodeId={id}
          defaultValue={data.settings.method || 'nearest'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              method: value,
            });
          }}
        >
          <MenuItem value="nearest">nearest</MenuItem>
          <MenuItem value="cubic">cubic</MenuItem>
          <MenuItem value="mitchell">mitchell</MenuItem>
          <MenuItem value="lanczos2">lanczos2</MenuItem>
          <MenuItem value="lanczos3">lanczos3</MenuItem>
        </Select>
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        />
        <NodeStatus nodeData={data} />
        <ImagePreview
          enabled={!!data.settings.enablePreview}
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
