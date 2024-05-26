/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import { MenuItem } from '@mui/material';
import useNodeStore from '../../store/store';
import {
  NodeData,
  handleSources,
  handleTargets,
} from './ColorPaletteNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleTargetImage } from './items/HandleTargetImage';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { Separator } from './items/Separator';

/**
 * https://lospec.com/palette-list
 * Select Sorting: Download (Most Popular)
 */
export function ColorPaletteNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node status={data.isProcessing ? 'processing' : undefined}>
      <NodeHeader title="ColorPalette" nodeId={id} />
      <NodeContent>
        <HandleTargetImage handleId={handleTargets.image.id} nodeId={id} />
        <Select
          label="Palette"
          nodeId={id}
          defaultValue={data.settings.paletteName || 'pico8'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              paletteName: value,
            });
          }}
        >
          <MenuItem value="pico8">PICO-8</MenuItem>
          <MenuItem value="Endesga32">Endesga32</MenuItem>
          <MenuItem value="Endesga64">Endesga64</MenuItem>
          <MenuItem value="oil6">OIL 6</MenuItem>
          <MenuItem value="RESURRECT64">RESURRECT 64</MenuItem>
          <MenuItem value="APOLLO">APOLLO</MenuItem>
          <MenuItem value="LOSPEC500">LOSPEC500</MenuItem>
          <MenuItem value="CC29">CC29</MenuItem>
          <MenuItem value="PEAR36">PEAR36</MenuItem>
          <MenuItem value="SLSO8">SLSO8</MenuItem>
          <MenuItem value="VINIK24">VINIK24</MenuItem>
          <MenuItem value="SWEETIE16">SWEETIE16</MenuItem>
          <MenuItem value="FANTASY24">FANTASY24</MenuItem>
          <MenuItem value="1BitMonitorGLOW">1BitMonitorGLOW</MenuItem>
          <MenuItem value="KIROKAZE_GAMEBOY">KIROKAZE_GAMEBOY</MenuItem>
          <MenuItem value="IceCreamGB">IceCreamGB</MenuItem>
          <MenuItem value="BLESSING">BLESSING</MenuItem>
          <MenuItem value="LostCentury">LostCentury</MenuItem>
          <MenuItem value="MidnightAblaze">MidnightAblaze</MenuItem>
          <MenuItem value="Twilight5">Twilight5</MenuItem>
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
