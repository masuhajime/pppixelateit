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
import { NodeData, handleSources, handleTargets } from './OutlineNodeBehavior';
import { Select } from './items/Select';
import { HandleTargetColor } from './items/HandleTargetColor';

export function OutlineNode({ id, data }: NodeProps<NodeData>) {
  const colorOutline =
    Number.isInteger(data.settings.a) &&
    Number.isInteger(data.settings.r) &&
    Number.isInteger(data.settings.g) &&
    Number.isInteger(data.settings.b)
      ? {
          a: data.settings.a,
          r: data.settings.r,
          g: data.settings.g,
          b: data.settings.b,
        }
      : {
          a: 255,
          r: 128,
          g: 128,
          b: 128,
        };
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="Outline" />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Select
          key="lineSide"
          label="line side"
          nodeId={id}
          defaultValue={data.settings.lineSide || 'inner'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              lineSide: value,
            });
          }}
        >
          <MenuItem value="inner" key="inner">
            inner
          </MenuItem>
          <MenuItem value="outer" key="outer">
            outer
          </MenuItem>
        </Select>
        <Select
          key="pixelCount"
          label="pixel count around"
          nodeId={id}
          defaultValue={(data.settings.number || 'optimized').toString()}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              number: value,
            });
          }}
        >
          {['optimized', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
            (value) => {
              return (
                <MenuItem value={value} key={`count_${value}`}>
                  {value}
                </MenuItem>
              );
            },
          )}
        </Select>
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
