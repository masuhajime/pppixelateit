import { posterize } from '../../process/w2b';
import useNodeStore, {
  getNodeSnapshot,
  handleSourceImageDefault,
  propagateValue,
} from '../../store/store';
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
} from './data/NodeData';

export const handleSources: Record<string, HandleSource> = {
  image: handleSourceImageDefault,
};

export const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    dataType: 'image',
  },
};

export type NodeData = {
  settings: {
    number?: number;
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
    store.updateNodeData<NodeData>(nodeId, {
      imageBuffer: data,
      completed: false,
    });
    // if (this.canStartProcess(node.id)) {
    //   this.nodeProcess(node.id)
    // }
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);
    // data.completed = true
    console.log(
      'node process resize to:',
      // node.data.imageBase64,
      node.id,
      node.type,
    );

    if (!node.data.imageBuffer?.buffer || !node.data.settings.number) {
      throw new Error('no image or number');
    }

    posterize(node.data.imageBuffer?.buffer, node.data.settings.number).then(
      (w2b) => {
        store.updateNodeData<NodeData>(nodeId, {
          completed: true,
          imageBuffer: {
            buffer: w2b,
            end: true,
          },
        });

        propagateValue(nodeId, handleSources);
        callback();
      },
    );
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.imageBuffer?.buffer && !!node.data.settings.number;
  },
};
