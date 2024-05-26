/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { Separator } from './items/Separator';
import { ImagePreview } from './items/ImagePreview';
import { Node } from './components/Node';
import { NodeHeader } from './components/NodeHeader';
import { NodeContent } from './components/NodeContent';
import { NodeStatus } from './components/NodeStatus';
import { NodeData, handleSources, handleTargets } from './MaskNodeBehavior';

export function MaskNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="MaskNode" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <HandleTargetImage
          handleId={handleTargets.mask.id}
          nodeId={id}
          label="Mask Image"
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
