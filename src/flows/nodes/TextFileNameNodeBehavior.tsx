import path from 'path';
import useNodeStore, {
  getNodeSnapshot,
  propagateValue,
} from '../../store/store';
import {
  HandleSource,
  NodeBaseData,
  NodeBehaviorInterface,
} from './data/NodeData';

export type NodeData = {
  text?: string;
  result?: string;
  settings: {};
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
  },
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
      case handleTargets.text.id:
        store.updateNodeData<NodeData>(nodeId, {
          text: data,
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

    console.log({
      text: node.data.text,
      r: path.parse(node.data.text || '').name,
    });

    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
      result: path.parse(node.data.text || '').name,
    });

    propagateValue(nodeId, handleSources);
    callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.text;
  },
};
