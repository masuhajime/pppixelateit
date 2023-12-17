// import { fs } from '@tauri-apps/api'
import { Buffer } from 'buffer';
import path from 'path';
import useNodeStore, {
  createNodeBehavior,
  getNodeSnapshot,
  handleSourceImageDefault,
  propagateValue,
} from '../../store/store';
import {
  HandleSource,
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
} from './data/NodeData';
// import path from 'path';

export type NodeData = {
  inputDirectoryPath?: string;
  inputFilePaths?: string[];
  inputFilePathsPointer?: number;
  filename?: string;
  settings?: {
    run?: string;
  };
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const handleSources = {
  image: handleSourceImageDefault,
  directory: {
    id: 'directory',
    dataType: 'directory',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId);
      if (!node.data.inputDirectoryPath) {
        throw new Error('no directory 1');
      }
      return node.data.inputDirectoryPath;
    },
  } as HandleSource,
  filename: {
    id: 'filename',
    dataType: 'text',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId);
      if (!node.data.filename) {
        throw new Error('no image');
      }
      return node.data.filename;
    },
  } as HandleSource,
};

export const nodeBehavior: NodeBehaviorInterface = createNodeBehavior({
  async initialize(nodeId) {
    const store = useNodeStore.getState();

    console.log(`initialize: ${nodeId}`);
    const node = getNodeSnapshot<NodeData>(nodeId);
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    if (!node.data.inputDirectoryPath) {
      throw new Error('no directory 2');
    }

    const files = await window.fs.readDir(node.data.inputDirectoryPath);
    const filePaths = files.map((file: string) => {
      return `${node.data.inputDirectoryPath}/${file}`;
    });
    store.updateNodeData<NodeData>(nodeId, {
      inputFilePaths: filePaths,
      inputFilePathsPointer: 0,
    });
    // log
    console.log('Image input dir files', filePaths);
  },
  async nodeProcess(nodeId: string, callback: () => void): Promise<void> {
    console.log(`process: ${nodeId}`);

    const node = getNodeSnapshot<NodeData>(nodeId);

    const nodeStore = useNodeStore.getState();

    const currentPoint = node.data.inputFilePathsPointer || 0;
    if (!node.data.inputFilePaths) {
      console.error({
        inputFilePaths: node.data.inputFilePaths,
      });

      throw new Error('no directory 3');
    }

    const currentFile = node.data.inputFilePaths[currentPoint];
    if (!currentFile) {
      throw new Error('no file');
    }
    const isEnd = !node.data.inputFilePaths[currentPoint + 1];

    const buffer = await window.fs.readAsBuffer(currentFile);

    // const buffer = await fs.readBinaryFile(currentFile);
    // console.log('image input dir process, set buffer', {
    //   currentFile,
    //   current: node.data.inputFilePathsPointer,
    //   next: node.data.inputFilePathsPointer + 1,
    // });
    nodeStore.updateNodeData<NodeData>(nodeId, {
      imageBuffer: {
        buffer: Buffer.from(buffer),
        end: isEnd,
      },
      filename: path.basename(currentFile),
      inputFilePathsPointer: currentPoint + 1,
      completed: true,
    });
    propagateValue(nodeId, handleSources);
    callback();
  },
  hasNextIteration(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);

    if (!node.data.inputFilePaths || !node.data.inputFilePathsPointer) {
      console.error({
        inputFilePaths: node.data.inputFilePaths,
        inputFilePathsPointer: node.data.inputFilePathsPointer,
      });
      throw new Error('no directory 4');
    }

    if (
      node.data.settings.run === 'one' &&
      node.data.inputFilePathsPointer > 0
    ) {
      return false;
    }

    const currentFile =
      node.data.inputFilePaths[node.data.inputFilePathsPointer];

    return !!currentFile;
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    console.log('canStartProcess: ', {
      nodeId,
      can: !!node.data.inputFilePaths,
      inputFilePaths: node.data.inputFilePaths,
    });

    return !!node.data.inputFilePaths;
  },
});
