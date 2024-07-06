/* eslint-disable import/prefer-default-export */
import ImageIcon from '@mui/icons-material/Image';
import { Box, Button, FormControl } from '@mui/material';
import { Buffer } from 'buffer';
import path from 'path';
import { NodeProps } from 'reactflow';
import useNodeStore from '../../store/store';
import { NodeData, handleSources } from './ImageInputNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceDirectory } from './items/HandleSourceDirectory';
import { HandleSourceImage } from './items/HandleSourceImage';
import { HandleSourceText } from './items/HandleSourceText';
import { ImagePreview } from './items/ImagePreview';

export function ImageInputNode({ id, data, selected }: NodeProps<NodeData>) {
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
    <NodeBasic
      id={id}
      nodeName="ImageInputNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
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
    </NodeBasic>
  );
}
