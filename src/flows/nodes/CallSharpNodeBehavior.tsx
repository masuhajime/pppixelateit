import useNodeStore, {
  getNodeSnapshot,
  handleSourceImageDefault,
} from '../../store/store';
import {
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
} from './data/NodeData';

export const handleSources = {
  image: handleSourceImageDefault,
};

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  },
};

export type NodeDataSettings = {};
export type NodeData = {
  settings: NodeDataSettings;
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
    store.updateNodeData(nodeId, {
      imageBuffer: data,
      completed: false,
    });
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const node = getNodeSnapshot<NodeData>(nodeId);

    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image');
    }

    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    // a.callSharp(node.data.imageBuffer.buffer).then((w2b) => {
    //   store.updateNodeData<NodeData>(nodeId, {
    //     completed: true,
    //   })

    //   propagateValue(nodeId, handleSources)
    //   callback()
    // })
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.imageBuffer?.buffer;
  },
};
