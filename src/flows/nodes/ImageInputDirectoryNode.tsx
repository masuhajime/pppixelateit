/* eslint-disable import/prefer-default-export */
import { NodeProps } from 'reactflow';

import FolderIcon from '@mui/icons-material/Folder';
import { Box, Button, FormControl } from '@mui/material';
// import { open } from '@tauri-apps/api/dialog'
import path from 'path';
import useNodeStore from '../../store/store';
import { NodeData, handleSources } from './ImageInputDirectoryNodeBehavior';
import { Node } from './components/Node';
import { NodeContent } from './components/NodeContent';
import { NodeHeader } from './components/NodeHeader';
import { NodeStatus } from './components/NodeStatus';
import { HandleSourceImage } from './items/HandleSourceImage';
import { ImagePreview } from './items/ImagePreview';
import { HandleSourceText } from './items/HandleSourceText';
// import { fs } from '@tauri-apps/api';
import { HandleSourceDirectory } from './items/HandleSourceDirectory';

export function ImageInputDirectoryNode({ id, data }: NodeProps<NodeData>) {
  const nodeStore = useNodeStore.getState();

  let directoryPath;
  if (data.inputDirectoryPath) {
    // get last directory name
    directoryPath = path.basename(data.inputDirectoryPath);
  }

  return (
    <Node>
      <NodeHeader title="Image Input Directory" />
      <NodeContent>
        <FormControl
          sx={{
            width: '100%',
          }}
        />

        <Box className="node-item">
          <Button
            className="nodrag"
            variant="outlined"
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'left',
              textTransform: 'none',
            }}
            onClick={async () => {
              const selectedDir = await window.dialog.selectFile({
                buttonLabel: 'Select Directory',
                properties: ['openDirectory'],
                filters: [],
              });
              if (selectedDir) {
                console.debug('selectedDir', selectedDir);
                window.fs
                  .readDir(selectedDir)
                  .then((files) => {
                    console.log(files);

                    const filePaths = files.map((file) => {
                      return file.path;
                    });
                    nodeStore.updateNodeData<NodeData>(id, {
                      inputDirectoryPath: selectedDir,
                      inputFilePaths: filePaths,
                    });
                    return 1;
                  })
                  .catch((err) => {
                    console.error(err);
                  });
                // const files = await fs.readDir(selectedDir);
                // const filePaths = files.map((file) => {
                //   return file.path;
                // });
                // nodeStore.updateNodeData<NodeData>(id, {
                //   inputDirectoryPath: selectedDir,
                //   inputFilePaths: filePaths,
                // });
              }
              // const selectedDir = await open({
              //   multiple: false,
              //   directory: true,
              //   filters: [],
              // });
              // if (Array.isArray(selectedDir)) {
              //   // user selectedFile multiple files
              //   console.error("can't select multiple files");
              // } else if (selectedDir === null) {
              //   // user cancelled the selection
              //   console.error("can't select file");
              // } else {
              //   // log
              //   // console.debug('selectedDir', selectedDir);
              //   // const files = await fs.readDir(selectedDir);
              //   // const filePaths = files.map((file) => {
              //   //   return file.path;
              //   // });
              //   // nodeStore.updateNodeData<NodeData>(id, {
              //   //   inputDirectoryPath: selectedDir,
              //   //   inputFilePaths: filePaths,
              //   // });
              // }
            }}
          >
            <FolderIcon
              sx={{
                marginRight: '8px',
              }}
            />
            <Box
              sx={{
                display: 'inline-block',
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {directoryPath || 'Select Directory'}
            </Box>
          </Button>
          {data.inputFilePaths !== undefined && (
            <Box>
              {data.inputFilePathsPointer} / {data.inputFilePaths.length}
            </Box>
          )}
        </Box>
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
        />
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
