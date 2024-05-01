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
  settings: {
    value: number;
  };
} & NodeBaseData;

export const handleSources = {
  number: {
    id: 'number',
    dataType: 'number',
    propagateValue: (nodeId: string) => {
      return getNodeSnapshot<NodeData>(nodeId).data.settings.value;
    },
  } as HandleSource<number>,
};

export const handleTargets = {};

export const nodeBehavior: NodeBehaviorInterface = {
  initializeSettingsOnNodeCreate() {
    return {
      value: 128,
    };
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    throw new Error(`Unknown handleId: ${handleId}`);
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: true,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);
    console.log('canStartProcess Number 1:', nodeId, node.data.settings.value);
    propagateValue(nodeId, handleSources);
    callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    console.log('canStartProcess Number:', nodeId, node.data.settings.value);

    if (node.data.settings.value === undefined) {
      return false;
    }
    return true;
  },
};
