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
import {
  NodeData,
  handleSources,
  handleTargets,
} from './AlphaFlattenNodeBehavior';
import { HandleTargetColor } from './items/HandleTargetColor';

export function AlphaFlattenNode({ id, data }: NodeProps<NodeData>) {
  const colorOutline =
    Number.isInteger(data.settings.a) &&
    Number.isInteger(data.settings.r) &&
    Number.isInteger(data.settings.g) &&
    Number.isInteger(data.settings.b)
      ? {
          r: data.settings.r,
          g: data.settings.g,
          b: data.settings.b,
          a: data.settings.a,
        }
      : {
          r: 128,
          g: 128,
          b: 128,
          a: 255,
        };
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="AlphaFlattenNode" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <HandleTargetColor
          handleId="color"
          label="Outline Color"
          nodeId={id}
          color={colorOutline}
          onChange={(color) => {
            useNodeStore.getState().updateNodeSetting(id, {
              r: Math.round(color.r),
              g: Math.round(color.g),
              b: Math.round(color.b),
              a: Math.round(color.a),
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
