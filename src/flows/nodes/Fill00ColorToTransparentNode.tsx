import { NodeProps } from 'reactflow';

import {
  NodeData,
  handleSources,
  handleTargets,
} from './Fill00ColorToTransparentNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import useNodeStore from '../../store/store';
import { NodeStatus } from './components/NodeStatus';

export function Fill00ColorToTransparentNode({
  id,
  data,
}: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Fill00ColorToTransparent" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        {/* <HandleTargetNumber
          name="number"
          handleId="number"
          nodeId={id}
          defaultValue={5}
          onChange={(value) => {
            useNodeStore.getState().updateNodeData(id, {
              ...data,
              number: value,
            })
          }}
        ></HandleTargetNumber> */}
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
