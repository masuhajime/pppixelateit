/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import { HandleTargetImage } from './items/HandleTargetImage';
import { Separator } from './items/Separator';
import { ImagePreview } from './items/ImagePreview';
import { Node } from './components/Node';
import { NodeHeader } from './components/NodeHeader';
import { NodeContent } from './components/NodeContent';
import { NodeStatus } from './components/NodeStatus';
import { NodeData, handleTargets } from './DebugNodeBehavior';

export function DebugNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="DebugNode" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Separator />
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
