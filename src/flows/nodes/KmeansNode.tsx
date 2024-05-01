/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import { NodeData, handleSources, handleTargets } from './KmeansNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import { NodeStatus } from './components/NodeStatus';
import { HandleTargetNumber } from './items/HandleTargetNumber';

export function KmeansNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="KmeansNode" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Separator />
        <HandleSourceImage
          label="Image"
          handleId={handleSources.image.id}
          nodeId={id}
        />
        <HandleTargetNumber
          name="number"
          handleId={handleTargets.number.id}
          nodeId={id}
          max={128}
          min={1}
          number={data.settings.number || 8}
          disableHandle
          onChange={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              number: value,
            });
          }}
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
