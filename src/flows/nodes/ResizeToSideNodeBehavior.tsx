import { ImageResizeParameter } from '../../main/process/dto';
import { resizeBaseOn } from '../../process/w2b';
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

export const handleSources = {
  image: handleSourceImageDefault,
};

export const handleTargets = {
  image: {
    id: 'image',
    dataType: 'image',
  },
  size: {
    id: 'number-size',
    dataType: 'number',
  },
};

export type NodeData = {
  size?: number;
  settings: {
    size?: number;
    resizeBase?: string;
    method?: string;
  };
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const nodeBehavior: NodeBehaviorInterface = {
  initialize(nodeId) {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      size: undefined,
    });
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    const store = useNodeStore.getState();
    console.log('dataIncoming ResizeToSide:', dataType, handleId);

    switch (handleId) {
      case handleTargets.image.id:
        store.updateNodeData<NodeData>(nodeId, {
          imageBuffer: data,
          completed: false,
        });
        break;
      case handleTargets.size.id:
        console.log(
          'dataIncoming ResizeToSide set to size:',
          dataType,
          handleId,
          data,
        );
        store.updateNodeData(nodeId, {
          size: data,
          completed: false,
        });
        break;
      default:
        throw new Error('handleId not found');
    }
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    console.log('nodeProcess ResizeToSide:', nodeId);
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

    if (
      !node.data.imageBuffer?.buffer ||
      !node.data.settings.size ||
      !node.data.settings.resizeBase ||
      !node.data.settings.method
    ) {
      return;
    }

    window.imageProcess
      .imageProcess('imageResize', {
        buffer: node.data.imageBuffer.buffer,
        method: node.data.settings.method,
        size: node.data.size || node.data.settings.size,
        resizeBase: node.data.settings.resizeBase,
      } as ImageResizeParameter)
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

    const isConnectedToSize =
      useNodeStore
        .getState()
        .getEdgesConnectedToNodeAndHandle(nodeId, handleTargets.size.id)
        .length > 0;

    console.log(
      'canStartProcess Resize:',
      !!node.data.imageBuffer?.buffer &&
        !!node.data.settings.size &&
        !!node.data.settings.resizeBase &&
        !!node.data.settings.method,
      {
        imageBuffer: !!node.data.imageBuffer?.buffer,
        method: node.data.settings.method,
        size: node.data.settings.size,
        size2: node.data.size,
        resizeBase: node.data.settings.resizeBase,
      },
    );

    console.log('canStartProcess Resize isConnectedToSize:', isConnectedToSize);
    if (isConnectedToSize) {
      return (
        !!node.data.imageBuffer?.buffer &&
        !!node.data.size &&
        !!node.data.settings.resizeBase &&
        !!node.data.settings.method
      );
    }
    return (
      !!node.data.imageBuffer?.buffer &&
      !!node.data.settings.size &&
      !!node.data.settings.resizeBase &&
      !!node.data.settings.method
    );
  },
};
