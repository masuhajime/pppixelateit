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
  directory?: string;
  result?: string;
  settings: {
    text?: string;
  };
} & NodeBaseData;

export const handleSources = {
  directory: {
    id: 'directory',
    dataType: 'text',
    propagateValue: (nodeId: string) =>
      getNodeSnapshot<NodeData>(nodeId).data.result,
  } as HandleSource<string>,
};

export const handleTargets = {
  directory: {
    id: 'directory',
    dataType: 'directory',
  } as HandleTarget,
  text: {
    id: 'text',
    dataType: 'text',
  } as HandleTarget,
};

export const nodeBehavior: NodeBehaviorInterface = {
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    const store = useNodeStore.getState();
    switch (handleId) {
      case 'text':
        store.updateNodeData<NodeData>(nodeId, {
          text: data,
          completed: false,
        });
        break;
      case 'directory':
        store.updateNodeData<NodeData>(nodeId, {
          directory: data,
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

    const dir = node.data.directory;
    const subDir = node.data.text || node.data.settings.text || '';

    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
      result: `${dir}/${subDir}`,
    });

    propagateValue(nodeId, handleSources);
    callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return (
      !!(node.data.text || node.data.settings.text) && !!node.data.directory
    );
  },
};
