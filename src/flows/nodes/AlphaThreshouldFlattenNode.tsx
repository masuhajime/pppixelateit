/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './AlphaThreshouldFlattenNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Separator } from './items/Separator';
import { SliderValue } from './items/SliderValue';

export function AlphaThreshouldFlattenNode({
  id,
  data,
  selected,
}: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="AlphaThreshouldFlattenNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
      <SliderValue
        label="threshould"
        onSelect={(v) => {
          useNodeStore.getState().updateNodeSetting(id, {
            threshold: v,
          });
        }}
        value={
          Number.isInteger(data.settings.threshold)
            ? data.settings.threshold
            : 10
        }
        min={0}
        max={100}
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
