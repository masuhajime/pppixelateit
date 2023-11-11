import path from 'path';
import { Buffer } from 'buffer';
import useNodeStore, {
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

export type NodeData = {
  inputFilePath?: string;
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const handleSources = {
  image: handleSourceImageDefault,
  directory: {
    id: 'directory',
    dataType: 'directory',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId);
      if (!node.data.inputFilePath) {
        throw new Error('no image');
      }
      return path.dirname(node.data.inputFilePath);
    },
  } as HandleSource,
  filename: {
    id: 'filename',
    dataType: 'text',
    propagateValue: (nodeId: string) => {
      const node = getNodeSnapshot<NodeData>(nodeId);
      if (!node.data.inputFilePath) {
        throw new Error('no image');
      }
      return path.basename(node.data.inputFilePath);
    },
  } as HandleSource,
};

export const nodeBehavior: NodeBehaviorInterface = {
  initialize(nodeId: string): void {
    // useNodeStore.getState().updateNodeData<NodeData>(nodeId, {
    //   inputFilePath: '/Users/masuhajime/pppjs/images/4-1.png',
    // });
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    throw new Error(`node process: should not be incoming: ${nodeId}`);
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const node = getNodeSnapshot<NodeData>(nodeId);
    // TODO: throw error is not image selected

    const nodeStore = useNodeStore.getState();
    if (!node.data.inputFilePath) {
      throw new Error('no image');
    }

    console.log('nodeProcess: ImageInputNode', nodeId, node.data.inputFilePath);

    window.fs
      .readAsBuffer(node.data.inputFilePath)
      .then((buffer) => {
        console.log('nodeProcess: ImageInputNode 111');

        nodeStore.updateNodeData<NodeData>(nodeId, {
          imageBuffer: {
            buffer: Buffer.from(buffer),
            end: true,
          },
          completed: true,
        });
        console.log('nodeProcess: ImageInputNode 222');
        propagateValue(nodeId, handleSources);
        callback();
        return 1;
      })
      .catch((err) => {
        console.error('nodeProcess: ImageInputNode 333', err);
      });
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.inputFilePath;
  },
};
