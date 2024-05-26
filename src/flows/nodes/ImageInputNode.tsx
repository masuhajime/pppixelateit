/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';
import { Buffer } from 'buffer';
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, FormControl, Typography } from '@mui/material';
import path from 'path';
import useNodeStore from '../../store/store';
import { NodeData, handleSources } from './ImageInputNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { ImagePreview } from './items/ImagePreview';
import { HandleSourceDirectory } from './items/HandleSourceDirectory';
import { HandleSourceText } from './items/HandleSourceText';

export function ImageInputNode({ id, data }: NodeProps<NodeData>) {
  const nodeStore = useNodeStore.getState();

  let inputFilePath = 'Select Image File';
  let directoryPath;
  if (data.inputFilePath) {
    // get file name from path
    inputFilePath = path.basename(data.inputFilePath) || 'Select Image File';
    // get last directory name
    directoryPath = path.basename(path.dirname(data.inputFilePath));
  }

  return (
    <Node>
      <NodeHeader title="Image Input" nodeId={id} />
      <NodeContent>
        <FormControl
          sx={{
            width: '100%',
          }}
        >
          <Box className="node-item">
            <Button
              className="nodrag"
              variant="outlined"
              sx={{
                width: '100%',
                minWidth: '100%',
                display: 'flex',
                justifyContent: 'left',
                textTransform: 'none',
              }}
              onClick={async () => {
                const selectedFile = await window.dialog.selectFile({
                  buttonLabel: 'Select Image File',
                  filters: [
                    {
                      name: 'Image',
                      extensions: ['png', 'jpeg', 'jpg', 'gif'],
                    },
                  ],
                });
                if (selectedFile) {
                  const buffer = await window.fs.readAsBuffer(selectedFile);
                  nodeStore.updateNodeData<NodeData>(id, {
                    inputFilePath: selectedFile,
                    imageBuffer: {
                      buffer: Buffer.from(buffer),
                      end: true,
                    },
                    completed: true,
                  });
                }
              }}
            >
              <ImageIcon
                sx={{
                  marginRight: '8px',
                }}
              />
              <Box
                sx={{
                  // ellipsis
                  display: 'inline-block',
                  width: '100%',
                  minWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  // direction: 'rtl',
                  // textAlign: 'left',
                }}
              >
                {inputFilePath}
              </Box>
            </Button>
          </Box>
        </FormControl>
        <NodeStatus nodeData={data} />
        <HandleSourceImage
          handleId={handleSources.image.id}
          label="Image"
          nodeId={id}
        />
        <HandleSourceDirectory
          handleId={handleSources.directory.id}
          label="Directory"
          nodeId={id}
          placeholder="Directory"
          directory={directoryPath}
          disabled
        />
        <HandleSourceText
          handleId={handleSources.filename.id}
          label="File Name"
          nodeId={id}
          propagateValue={
            data.inputFilePath ? path.basename(data.inputFilePath) : undefined
          }
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
