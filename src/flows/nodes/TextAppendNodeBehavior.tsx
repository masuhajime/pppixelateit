import useNodeStore, {
  getNodeSnapshot,
  propagateValue,
} from '../../store/store';
import {
  HandleSource,
  HandleTarget,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData';

export type NodeData = {
  text?: string;
  append?: string;
  result?: string;
  settings: {
    text?: string;
    append?: string;
  };
} & NodeBaseData;

export const handleSources = {
  text: {
    id: 'text',
    dataType: 'text',
    propagateValue: (nodeId: string) =>
      getNodeSnapshot<NodeData>(nodeId).data.result,
  } as HandleSource<string>,
};

export const handleTargets = {
  text: {
    id: 'text',
    dataType: 'text',
  } as HandleTarget,
  append: {
    id: 'text-append',
    dataType: 'text',
  } as HandleTarget,
};

export const nodeBehavior: NodeBehaviorInterface = {
  initialize(nodeId) {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      text: undefined,
      append: undefined,
    });
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    const store = useNodeStore.getState();
    switch (handleId) {
      case handleTargets.text.id:
        store.updateNodeData<NodeData>(nodeId, {
          text: data,
          completed: false,
        });
        break;
      case handleTargets.append.id:
        store.updateNodeData<NodeData>(nodeId, {
          append: data,
          completed: false,
        });
        break;
      default:
        throw new Error(`Unknown handleId: ${handleId}`);
    }
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);

    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
      result:
        (node.data.text || node.data.settings.text || '') +
        (node.data.append || node.data.settings.append || ''),
    });

    propagateValue(nodeId, handleSources);
    callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return (
      !!(node.data.text || node.data.settings.text) &&
      !!(node.data.append || node.data.settings.append)
    );
  },
};
