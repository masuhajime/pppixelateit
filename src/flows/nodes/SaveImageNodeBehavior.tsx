// import { fs } from '@tauri-apps/api'
// import Jimp from 'jimp';
import useNodeStore, { getNodeSnapshot } from '../../store/store';
import {
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
} from './data/NodeData';

export const handleSources = {};

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  },
  filename: {
    id: 'text-filename',
    dataType: 'text',
  },
  directory: {
    id: 'directory',
    dataType: 'directory',
  },
};

export type NodeData = {
  filename?: string;
  directory?: string;
  errorMessage?: string;
  settings: {
    filename?: string;
    directory?: string;
  };
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    const store = useNodeStore.getState();
    console.log('data incoming file: ', {
      nodeId,
      handleId,
      dataType,
      filename: data,
    });
    switch (handleId) {
      case handleTargets.image.id:
        store.updateNodeData<NodeData>(nodeId, {
          imageBuffer: data,
          completed: false,
        });
        break;
      case handleTargets.filename.id:
        store.updateNodeData<NodeData>(nodeId, {
          filename: data,
          completed: false,
        });
        break;
      case handleTargets.directory.id:
        store.updateNodeData<NodeData>(nodeId, {
          directory: data,
          completed: false,
        });
        break;
      default:
        break;
    }
  },
  async nodeProcess(nodeId: string, callback: () => void): Promise<void> {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);

    const filename = node.data.filename || node.data.settings.filename;
    const directory = node.data.directory || node.data.settings.directory;

    if (
      node.data.imageBuffer?.buffer === undefined ||
      filename === undefined ||
      directory === undefined
    ) {
      console.error('Either of image buffer, filename, directory is undefined');
      return;
    }
    // imageBuffer to jimp instance
    // const jimpImage = await Jimp.read(node.data.imageBuffer?.buffer);

    // // jimp instance to png
    // const pngBuffer = await jimpImage.getBufferAsync(Jimp.MIME_PNG);

    // check directory exists
    const isDirectory = await window.fs.isDirectory(directory);
    // log
    console.log('isDirectory', isDirectory);
    if (!isDirectory) {
      console.error('Directory not exists');
      store.updateNodeData<NodeData>(nodeId, {
        completed: true,
        errorMessage: 'Directory not exists',
      });
      callback();
      return;
    }

    window.fs
      .saveAsBuffer(`${directory}/${filename}`, node.data.imageBuffer?.buffer)
      .then(() => {
        console.log('saved image' + `${directory}/${filename}`);
        store.updateNodeData<NodeData>(nodeId, {
          completed: true,
          errorMessage: undefined,
        });
        callback();
        return 1;
      })
      .catch((err) => {
        console.error(err);
        store.updateNodeData<NodeData>(nodeId, {
          completed: true,
        });
        callback();
      });

    // log
    console.log('saving image to ' + `${directory}/${filename}`);
    // await fs.writeBinaryFile(`${directory}/${filename}`, pngBuffer);
    console.log('saved image' + `${directory}/${filename}`);

    // store.updateNodeData<NodeData>(nodeId, {
    //   completed: true,
    // });
    // callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    console.log('canStartProcess save image: ', {
      nodeId,
      buffer: !!node.data.imageBuffer?.buffer,
      imageBuffer: !!node.data.imageBuffer,
      filename: node.data.filename,
      directory: node.data.directory,
    });
    return (
      !!node.data.imageBuffer?.buffer &&
      !!(node.data.filename || node.data.settings.filename) &&
      !!(node.data.directory || node.data.settings.directory)
    );
  },
};
