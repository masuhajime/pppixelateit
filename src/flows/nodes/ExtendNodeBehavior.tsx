import { ImageExtendParameter } from '../../main/process/dto';
import useNodeStore, {
  getNodeSnapshot,
  handleSourceImageDefault,
  propagateValue,
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
  top: {
    id: 'top',
    dataType: 'number',
  },
  bottom: {
    id: 'bottom',
    dataType: 'number',
  },
  left: {
    id: 'left',
    dataType: 'number',
  },
  right: {
    id: 'right',
    dataType: 'number',
  },
};

export type NodeData = {
  settings: {
    unit: string;
    top: number;
    bottom: number;
    left: number;
    right: number;
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
    if (handleId === handleTargets.image.id) {
      const store = useNodeStore.getState();
      store.updateNodeData<NodeData>(nodeId, {
        imageBuffer: data,
        completed: false,
      });
    }
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);

    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image data');
    }

    window.imageProcess
      .imageProcess('imageExtend', {
        buffer: node.data.imageBuffer.buffer,
        unit: node.data.settings.unit,
        top: node.data.settings.top,
        bottom: node.data.settings.bottom,
        left: node.data.settings.left,
        right: node.data.settings.right,
      } as ImageExtendParameter)
      .then((buffer) => {
        store.updateNodeData<NodeData>(nodeId, {
          completed: true,
          imageBuffer: {
            buffer,
            end: true,
          },
        });

        propagateValue(nodeId, handleSources);
        callback();
        return 0;
      })
      .catch((err) => {
        console.error(err);
      });
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.imageBuffer?.buffer;
  },
};
