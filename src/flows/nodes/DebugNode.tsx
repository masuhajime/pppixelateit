/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { Separator } from './items/Separator';
import { ImagePreview } from './items/ImagePreview';
import { Node } from './components/Node';
import { NodeHeader } from './components/NodeHeader';
import { NodeContent } from './components/NodeContent';
import { NodeStatus } from './components/NodeStatus';
import { NodeData, handleSources, handleTargets } from './DebugNodeBehavior';
import { Select } from './items/Select';

export function DebugNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="DebugNode" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Select
          label="pixel count around"
          nodeId={id}
          defaultValue={(data.settings.number || '2').toString()}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              number: value,
            });
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
            return (
              <MenuItem value={value} key={value}>
                {value}
              </MenuItem>
            );
          })}
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
