import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './PosterizeNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { HandleTargetNumber } from './items/HandleTargetNumber';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';

export function PosterizeNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="PosterizeNode" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <HandleTargetNumber
          name="number"
          handleId="number"
          nodeId={id}
          defaultValue={data.settings.number || 8}
          onChange={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              number: value,
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
