import { createWithEqualityFn } from 'zustand/traditional';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  getOutgoers,
  getIncomers,
} from 'reactflow';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialEdges, initialNodes } from './initialNodesDefault';
import {
  BufferSequenceable,
  HandleSource,
  NodeBaseData,
  NodeBaseDataSettings,
  NodeBehaviorInterface,
  getNodeBehaviorCacheByType,
} from '../flows/nodes/data/NodeData';

export type RFState = {
  initialized: boolean;
  modified: boolean;
  nodes: Node[];
  edges: Edge[];
  setInitialized: (initialized: boolean) => void;
  setModified: (modified: boolean) => void;
  getNodeTargetedFrom: (nodeId: string) => Node[];
  getNodeTargetedTo: (nodeId: string) => Node[];
  getEdgesConnectedToNodeAndHandle(nodeId: string, handleId: string): Edge[];
  updateNodeData: <T = NodeBaseData>(nodeId: string, data: Partial<T>) => void;
  updateNodeSetting: <T = NodeBaseDataSettings>(
    nodeId: string,
    settings: Partial<T>,
  ) => void;
  getNode<T = NodeBaseData>(nodeId: string): Node<T>;
  edgeDelete: (edgeId: string) => void;
  nodeDelete: (nodeId: string) => void;
  getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  nodeAdd: (node: Node) => void;
  nodeSetProcessing(nodeId: string, processing: boolean): void;
  nodeGetProcessing(nodeId: string): boolean;
  nodeSetAllUncompleted(): void;
  nodeAllCleareBuffer(): void;
  nodeSetCompleted(nodeId: string, completed: boolean): void;
  nodeGetCompleted(nodeId: string): boolean;
  setAllNodeEnablePreview: (enablePreview: boolean) => void;
  getPartialState(): Partial<RFState>;
  getPartialStateJsonString(): string;
  setPartialState: (partialState: Partial<RFState>) => void;
};

const partialize = (state: RFState): Partial<RFState> => {
  const objects: Partial<RFState> = Object.fromEntries(
    Object.entries(state).filter(([key]) => {
      return ['nodes', 'edges'].includes(key);
    }),
  );

  // remove keys in edges.data without "settings" key in objects.nodes
  objects.nodes = (objects.nodes || []).map((node) => {
    // if (node.type === 'ImageInputNode') return node;
    const newNode = { ...node };
    if (node.data && node.data.settings) {
      const settings = { ...node.data.settings };
      newNode.data = { settings };
    } else {
      newNode.data = { settings: {} };
    }
    return newNode;
  });

  return objects;
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useNodeStore = createWithEqualityFn(
  persist(
    (set, get: () => RFState) => {
      return {
        initialized: false,
        modified: false,
        nodes: initialNodes,
        edges: initialEdges,
        setInitialized: (initialized: boolean) => {
          set({ initialized });
        },
        setModified: (modified: boolean) => {
          set({ modified });
        },
        getNodeTargetedFrom(nodeId: string): Node[] {
          const nodeFrom = get().nodes.find((node) => node.id === nodeId);
          if (!nodeFrom) throw new Error('node not found');
          return getOutgoers(nodeFrom, get().nodes, get().edges);
        },
        getNodeTargetedTo(nodeId: string): Node[] {
          const nodeTo = get().nodes.find((node) => node.id === nodeId);
          if (!nodeTo) throw new Error('node not found');
          return getIncomers(nodeTo, get().nodes, get().edges);
        },
        getEdgesConnectedToNodeAndHandle(
          nodeId: string,
          handleId: string,
        ): Edge[] {
          return get().edges.filter(
            (edge) => edge.target === nodeId && edge.targetHandle === handleId,
          );
        },
        updateNodeData<T = NodeBaseData>(nodeId: string, data: T) {
          set({
            nodes: get().nodes.map((node) => {
              if (node.id === nodeId) {
                // it's important to create a new object here, to inform React Flow about the cahnges
                node.data = { ...node.data, ...data };
              }
              return node;
            }),
          });
        },
        updateNodeSetting<T = NodeBaseDataSettings>(
          nodeId: string,
          settings: T,
        ) {
          const { initialized } = get();
          const modified = initialized
            ? {
                modified: true,
              }
            : {};
          set({
            ...modified,
            nodes: get().nodes.map((node) => {
              if (node.id === nodeId) {
                const newSettings = { ...node.data.settings, ...settings };
                node.data = { ...node.data, settings: newSettings };
              }
              return node;
            }),
          });
        },
        getNode<T = NodeBaseData>(nodeId: string): Node<T> {
          const node = get().nodes.find((node) => node.id === nodeId);
          if (!node) throw new Error('node not found');
          return node as Node;
        },
        edgeDelete: (edgeId: string) => {
          set({
            modified: true,
            edges: get().edges.filter((edge) => edge.id !== edgeId),
          });
        },
        nodeDelete: (nodeId: string) => {
          set({
            modified: true,
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter(
              (edge) => edge.source !== nodeId && edge.target !== nodeId,
            ),
          });
        },
        getOutgoingEdgesFromSourceNode(sourceNodeId: string): Edge[] {
          return get().edges.filter((edge) => edge.source === sourceNodeId);
        },
        onNodesChange: (changes: NodeChange[]) => {
          // console.log('onNodesChange', changes);

          const typeModify = ['remove'];
          const hasTypeModify = changes.some((change) => {
            const includes = typeModify.includes(change.type);
            if (includes) {
              return true;
            }
            if (change.type === 'position' && !!change.position) {
              return true;
            }
            return false;
          });

          const { initialized } = get();
          const modified =
            initialized && hasTypeModify
              ? {
                  modified: true,
                }
              : {};
          set({
            ...modified,
            nodes: applyNodeChanges(changes, get().nodes),
          });
        },
        onEdgesChange: (changes: EdgeChange[]) => {
          console.log('onEdgesChange', changes);
          const { initialized } = get();
          const typeModify = ['remove'];
          const hasTypeModify = changes.some((change) => {
            return typeModify.includes(change.type);
          });
          const modified =
            initialized && hasTypeModify
              ? {
                  modified: true,
                }
              : {};
          set({
            ...modified,
            edges: applyEdgeChanges(changes, get().edges),
          });
        },
        onConnect: (connection: Connection) => {
          console.log('connection', connection);
          const { initialized } = get();
          const modified = initialized
            ? {
                modified: true,
              }
            : {};
          set({
            ...modified,
            edges: addEdge(connection, get().edges),
          });
        },
        nodeAdd: (node: Node) => {
          set({
            modified: true,
            nodes: [...get().nodes, node],
          });
        },
        nodeSetProcessing(nodeId: string, processing: boolean): void {
          set({
            nodes: get().nodes.map((node) => {
              if (node.id === nodeId) {
                node.data = { ...node.data, isProcessing: processing };
              }
              return node;
            }),
          });
        },
        nodeGetProcessing(nodeId: string): boolean {
          const node = get().nodes.find((nodeA) => nodeA.id === nodeId);
          if (!node) throw new Error('node not found');
          return node.data.isProcessing;
        },
        nodeSetAllUncompleted(): void {
          set({
            nodes: get().nodes.map((node) => {
              node.data = {
                ...node.data,
                completed: false,
                isProcessing: false,
                processTime: undefined,
              };
              return node;
            }),
          });
        },
        nodeAllCleareBuffer(): void {
          set({
            nodes: get().nodes.map((node) => {
              node.data = { ...node.data, imageBuffer: undefined };
              return node;
            }),
          });
        },
        nodeSetCompleted(nodeId: string, completed: boolean): void {
          set({
            nodes: get().nodes.map((node) => {
              if (node.id === nodeId) {
                node.data = { ...node.data, isCompleted: completed };
              }
              return node;
            }),
          });
        },
        nodeGetCompleted(nodeId: string): boolean {
          const node = get().nodes.find((nodeA) => nodeA.id === nodeId);
          if (!node) throw new Error('node not found');
          return node.data.completed;
        },
        setAllNodeEnablePreview: (enablePreview: boolean) => {
          set({
            nodes: get().nodes.map((node) => {
              node.data = {
                ...node.data,
                settings: { ...node.data.settings, enablePreview },
              };
              return node;
            }),
          });
        },
        getPartialState: () => {
          return partialize(get());
        },
        getPartialStateJsonString: () => {
          return JSON.stringify(partialize(get()));
        },
        setPartialState: (partialState: Partial<RFState>) => {
          set({
            initialized: false,
            modified: false,
            ...partialState,
          });
        },
      };
    },
    {
      name: 'node-edge-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return partialize(state);
        // const objects: Partial<RFState> =
        //     Object.fromEntries(
        //         Object.entries(state)
        //             .filter(([key]) => {
        //                 return ['nodes', 'edges'].includes(key)
        //             })
        //     );

        // //remove keys in edges.data without "settings" key in objects.nodes
        // objects.nodes = (objects.nodes || []).map((node) => {
        //     // if (node.type === 'ImageInputNode') return node;
        //     const newNode = { ...node };
        //     if (node.data && node.data.settings) {
        //         const settings = { ...node.data.settings };
        //         newNode.data = { settings };
        //     } else {
        //         newNode.data = { settings: {} };
        //     }
        //     return newNode;
        // });

        // return objects;
      },
      // onRehydrateStorage: (state) => {
      //     console.log('hydration starts')
      //     // optional
      //     return (state, error) => {
      //         if (error) {
      //             console.log('an error happened during hydration', error)
      //         } else {
      //             console.log('hydration finished')
      //         }
      //     }
      // },
      // store data partialize https://docs.pmnd.rs/zustand/integrations/persisting-store-data
    },
  ),
);

export const getNodeSnapshot = <T = NodeBaseData>(nodeId: string) =>
  useNodeStore.getState().getNode<T>(nodeId);

export const updateSetting = (
  nodeId: string,
  key: string,
): ((value: any) => void) => {
  return (value) => {
    useNodeStore.getState().updateNodeSetting(nodeId, {
      [key]: value,
    });
  };
};

export const defaultNodeInitialize = (nodeId: string) => {
  const store = useNodeStore.getState();
  store.updateNodeData<NodeBaseData>(nodeId, {
    completed: false,
    isProcessing: false,
    processTime: undefined,
  });
};

export const handleSourceImageDefault = {
  id: 'image',
  dataType: 'buffer',
  propagateValue: (nodeId: string) =>
    getNodeSnapshot<{
      imageBuffer: BufferSequenceable;
    }>(nodeId).data.imageBuffer,
} as HandleSource<BufferSequenceable>;

export const handleSourceTextDefault = {
  id: 'text',
  dataType: 'text',
  propagateValue: (nodeId: string) =>
    getNodeSnapshot<{
      text: string;
    }>(nodeId).data.text,
} as HandleSource<string>;

export const handleSourceStringDefault = handleSourceTextDefault;

export default useNodeStore;

export const propagateValue = (
  nodeId: string,
  handleSources: Record<string, HandleSource>,
  hasNextIteration?: boolean,
) => {
  const store = useNodeStore.getState();
  console.log('######### propagateValue', {
    nodeId,
    handleSources,
    hasNextIteration,
  });

  store.getOutgoingEdgesFromSourceNode(nodeId).forEach((edge) => {
    // edge = Handle source
    const targetNode = store.getNode(edge.target);
    if (!targetNode.type) {
      return;
    }
    const nodeBehavior = getNodeBehaviorCacheByType(targetNode.type);

    Object.values(handleSources).forEach((handleSource) => {
      if (!edge.targetHandle) {
        return;
      }
      if (handleSource.id !== edge.sourceHandle) {
        return;
      }
      if (edge.target !== targetNode.id) {
        return;
      }
      console.log('propagate value to: ', {
        targetNode,
        handleSource,
        edge,
        nodeId,
      });
      nodeBehavior.dataIncoming(
        targetNode.id,
        edge.targetHandle,
        handleSource.dataType,
        handleSource.propagateValue(nodeId),
      );
    });
  });
};

// TODO: Still need this ?
export const createNodeBehavior = (
  n: Partial<NodeBehaviorInterface>,
): NodeBehaviorInterface => {
  return { ...defaultNodeBehavior, ...n } as NodeBehaviorInterface;
};
export const defaultNodeBehavior: NodeBehaviorInterface = {
  dataIncoming(nodeId, handleId, dataType, data) {
    throw new Error(`node process: should not be incoming:${nodeId}`);
  },
  initialize: defaultNodeInitialize,
  nodeProcess(nodeId, callback) {
    throw new Error(`node process: should not be processing:${nodeId}`);
  },
  canStartProcess(nodeId) {
    return false;
  },
  hasNextIteration(nodeId) {
    return false;
  },
};
