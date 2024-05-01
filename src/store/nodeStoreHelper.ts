import useNodeStore from './store';

export default class NodeStoreHelper {
  static isConnected = (nodeId: string, handleTargetId: string) => {
    return (
      useNodeStore
        .getState()
        .getEdgesConnectedToNodeAndHandle(nodeId, handleTargetId).length > 0
    );
  };
}
