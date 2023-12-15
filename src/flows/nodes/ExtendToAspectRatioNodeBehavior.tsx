import {
  ImageExtendParameter,
  ImageExtendToAspectRatioParameter,
} from '../../main/process/dto';
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
  width: {
    id: 'width',
    dataType: 'number',
  },
  height: {
    id: 'height',
    dataType: 'number',
  },
};

export type NodeData = {
  settings: {
    width: number;
    height: number;
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
      .imageProcess('imageExtendToAspectRatio', {
        buffer: node.data.imageBuffer.buffer,
        width: node.data.settings.width,
        height: node.data.settings.height,
      } as ImageExtendToAspectRatioParameter)
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
