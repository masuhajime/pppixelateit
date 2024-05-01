import { ImageExtendParameter } from '../../main/process/dto';
import NodeStoreHelper from '../../store/nodeStoreHelper';
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
    id: 'number-top',
    dataType: 'number',
  },
  bottom: {
    id: 'number-bottom',
    dataType: 'number',
  },
  left: {
    id: 'number-left',
    dataType: 'number',
  },
  right: {
    id: 'number-right',
    dataType: 'number',
  },
};

export type NodeData = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  settings: {
    unit: string;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const nodeBehavior: NodeBehaviorInterface = {
  initializeSettingsOnNodeCreate() {
    return {
      unit: 'pixel',
      top: 11,
      bottom: 10,
      left: 10,
      right: 10,
    };
  },
  initialize(nodeId) {
    useNodeStore.getState().updateNodeData(nodeId, {
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined,
      completed: false,
    });
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    switch (handleId) {
      case handleTargets.top.id:
        useNodeStore.getState().updateNodeData(nodeId, {
          top: data,
          completed: false,
        });
        break;
      case handleTargets.bottom.id:
        useNodeStore.getState().updateNodeData(nodeId, {
          bottom: data,
          completed: false,
        });
        break;
      case handleTargets.left.id:
        useNodeStore.getState().updateNodeData(nodeId, {
          left: data,
          completed: false,
        });
        break;
      case handleTargets.right.id:
        useNodeStore.getState().updateNodeData(nodeId, {
          right: data,
          completed: false,
        });
        break;
      case handleTargets.image.id:
        useNodeStore.getState().updateNodeData<NodeData>(nodeId, {
          imageBuffer: data,
          completed: false,
        });
        break;
      default:
        throw new Error('handleId not found');
    }
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

    const isConnectedTop = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.top.id,
    );
    const isConnectedBottom = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.bottom.id,
    );
    const isConnectedLeft = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.left.id,
    );
    const isConnectedRight = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.right.id,
    );

    window.imageProcess
      .imageProcess('imageExtend', {
        buffer: node.data.imageBuffer.buffer,
        unit: node.data.settings.unit,
        top: isConnectedTop ? node.data.top : node.data.settings.top,
        bottom: isConnectedBottom
          ? node.data.bottom
          : node.data.settings.bottom,
        left: isConnectedLeft ? node.data.left : node.data.settings.left,
        right: isConnectedRight ? node.data.right : node.data.settings.right,
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

    const isConnectedTop = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.top.id,
    );
    const isConnectedBottom = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.bottom.id,
    );
    const isConnectedLeft = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.left.id,
    );
    const isConnectedRight = NodeStoreHelper.isConnected(
      nodeId,
      handleTargets.right.id,
    );

    const top = isConnectedTop ? node.data.top : node.data.settings.top;
    const bottom = isConnectedBottom
      ? node.data.bottom
      : node.data.settings.bottom;
    const left = isConnectedLeft ? node.data.left : node.data.settings.left;
    const right = isConnectedRight ? node.data.right : node.data.settings.right;

    return (
      !!node.data.settings.unit &&
      top !== undefined &&
      bottom !== undefined &&
      left !== undefined &&
      right !== undefined &&
      node.data.imageBuffer?.buffer !== undefined
    );
  },
};
