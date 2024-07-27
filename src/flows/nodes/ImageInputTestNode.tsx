/* eslint-disable import/prefer-default-export */
import { FormControl, MenuItem } from '@mui/material';
import { NodeProps } from 'reactflow';
import useNodeStore from '../../store/store';
import {
  NodeData,
  getImageBufferForImageInputTest,
  handleSources,
} from './ImageInputTestNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';
import { useEffect } from 'react';

export function ImageInputTestNode({
  id,
  data,
  selected,
}: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="ImageInputTestNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <FormControl
        sx={{
          width: '100%',
        }}
      >
        <Select
          label="Image"
          nodeId={id}
          defaultValue={data.settings.imageName || 'Apple'}
          onSelect={(value) => {
            useNodeStore.getState().updateNodeSetting(id, {
              imageName: value,
            });
            // check if value is string
            if (typeof value === 'string') {
              useNodeStore.getState().updateNodeData<NodeData>(id, {
                imageBuffer: {
                  buffer: getImageBufferForImageInputTest(value),
                  end: true,
                },
                completed: true,
              });
            }
          }}
        >
          <MenuItem value="Apple">Apple</MenuItem>
          <MenuItem value="Sphere">Sphere</MenuItem>
          <MenuItem value="Horse">Horse</MenuItem>
          <MenuItem value="Tree">Tree</MenuItem>
          <MenuItem value="Potion">Potion</MenuItem>
          <MenuItem value="BuildingFacade">Bulding Facade</MenuItem>
          <MenuItem value="BuildingIsometric">Bulding Isometric</MenuItem>
          <MenuItem value="GirlA">GirlA</MenuItem>
          <MenuItem value="GirlB">GirlB</MenuItem>
          <MenuItem value="DarkForest">DarkForest</MenuItem>
          <MenuItem value="WhiteClouds">WhiteClouds</MenuItem>
          <MenuItem value="GradientWB">GradientWB</MenuItem>
          <MenuItem value="Gradient">Gradient</MenuItem>
        </Select>
      </FormControl>
      <HandleSourceImage
        handleId={handleSources.image.id}
        label="Image"
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
