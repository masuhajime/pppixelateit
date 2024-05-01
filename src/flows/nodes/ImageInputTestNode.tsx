/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';
import { Box, FormControl, MenuItem } from '@mui/material';
import path from 'path';
import useNodeStore from '../../store/store';
import {
  NodeData,
  getImageBufferForImageInputTest,
  handleSources,
} from './ImageInputTestNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { ImagePreview } from './items/ImagePreview';
import { Select } from './items/Select';

export function ImageInputTestNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Node>
      <NodeHeader title="Test Image" />
      <NodeContent>
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
          </Select>
        </FormControl>
        <NodeStatus nodeData={data} />
        <HandleSourceImage
          handleId={handleSources.image.id}
          label="Image"
          nodeId={id}
        />
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
