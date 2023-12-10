import {
  ImageBufferOnlyParameter,
  ImageMaskParameter,
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
  mask: {
    id: 'mask',
    dataType: 'image',
  },
};

export type NodeData = {
  settings: {};
  imageMaskBuffer?: ImageBufferOnlyParameter;
  imageBufferUpdated?: boolean;
  imageMaskBufferUpdated?: boolean;
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
    if (handleId === handleTargets.image.id) {
      store.updateNodeData<NodeData>(nodeId, {
        imageBuffer: data,
        completed: false,
        imageBufferUpdated: true,
      });
    }
    if (handleId === handleTargets.mask.id) {
      store.updateNodeData<NodeData>(nodeId, {
        imageMaskBuffer: data,
        completed: false,
        imageMaskBufferUpdated: true,
      });
    }
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
    if (!node.data.imageBuffer?.buffer || !node.data.imageMaskBuffer?.buffer) {
      throw new Error('no image or number');
    }

    window.imageProcess
      .imageProcess('imageMask', {
        buffer: node.data.imageBuffer.buffer,
        mask: node.data.imageMaskBuffer.buffer,
      } as ImageMaskParameter)
      .then((buffer) => {
        store.updateNodeData<NodeData>(nodeId, {
          completed: true,
          imageBufferUpdated: false,
          imageMaskBufferUpdated: false,
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
        console.error('DebugNodeBehavior', err);
      });
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return (
      !!node.data.imageBuffer?.buffer &&
      !!node.data.imageMaskBuffer?.buffer &&
      !!node.data.imageBufferUpdated &&
      !!node.data.imageMaskBufferUpdated
    );
  },
};
