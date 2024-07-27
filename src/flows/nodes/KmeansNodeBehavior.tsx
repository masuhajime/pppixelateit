import { ImageKmeansParameter } from '../../main/process/dto';
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

export const handleSources: Record<string, HandleSource> = {
  image: handleSourceImageDefault,
};

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  },
  number: {
    id: 'number',
    dataType: 'number',
  },
};

export type NodeData = {
  settings?: {
    number?: number;
    ditheringMatrix?: 'none' | 'matrix2' | 'matrix4';
    ditheringStrength?: number;
    seed?: number;
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
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);
    // data.completed = true
    console.log('node process test:', node.id, node.type);

    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image data');
    }

    window.imageProcess
      .imageProcess('imageKmeans', {
        buffer: node.data.imageBuffer.buffer,
        number: node.data.settings?.number || 8,
        ditheringMatrix: node.data.settings?.ditheringMatrix || 'none',
        ditheringStrength: node.data.settings?.ditheringStrength || 4,
        seed: node.data.settings?.seed || 0,
      } as ImageKmeansParameter)
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
        console.error('KmeansNodeBehavior', err);
      });
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.imageBuffer?.buffer;
  },
};
