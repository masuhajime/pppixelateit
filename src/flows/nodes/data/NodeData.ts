import nodeDefines, { nodeDefineMap } from '../../nodes';

export type PropagateDataType =
  | 'image'
  | 'number'
  | 'buffer'
  | 'text'
  | 'directory'
  | 'color';

export type HandleSource<T = any> = {
  id: string;
  dataType: PropagateDataType;
  propagateValue: (nodeId: string) => T;
};

export type HandleTarget = {
  id: string;
  dataType: PropagateDataType;
};

export type NodeBaseDataSettings = {
  [k: string]: any;
};

export type NodeBaseData = {
  settings: NodeBaseDataSettings;
  isProcessing: boolean;
  completed?: boolean;
  processTime?: number;
};
export type BufferSequenceable = {
  buffer?: Buffer;
  end: boolean;
};
export type NodeBaseDataImageBuffer = {
  imageBuffer?: BufferSequenceable;
  settings: {
    enablePreview?: boolean;
  };
};

// define abstract class of NodeBehavior
// abstract class NodeBehaviorAbstract {
//   initialize?(nodeId: string): void
//   abstract dataIncoming(
//     nodeId: string,
//     handleId: string,
//     dataType: PropagateDataType,
//     data: any
//   ): void
//   abstract nodeProcess(nodeId: string, callback: () => void): void
//   abstract canStartProcess(nodeId: string): boolean
//   hasNextIteration?(nodeId: string): boolean
// }

export interface NodeBehaviorInterface {
  dataIncoming: (
    nodeId: string,
    handleId: string,
    dataType: PropagateDataType,
    data: any,
  ) => void;
  initialize?(nodeId: string): void;
  nodeProcess: (nodeId: string, callback: () => void) => void;
  canStartProcess(nodeId: string): boolean;
  hasNextIteration?(nodeId: string): boolean;
}

const nodeBehaviorCache: { [key: string]: NodeBehaviorInterface } = {};

export const getNodeBehaviorCacheByType = (type: string) => {
  if (nodeBehaviorCache[type] === undefined) {
    throw new Error(`nodeBehaviorCache ${type} is undefined`);
  }
  return nodeBehaviorCache[type];
};

export const getNodeBehavior = async (
  type: string,
): Promise<NodeBehaviorInterface> => {
  return import(`../${type}Behavior.tsx`).then((module) => {
    return module.nodeBehavior;
  });
};

// return nodeDefines
// .map((nodeGroup) => {
//   return nodeGroup.nodes.map((node) => {
//     return node.name;
//   });
// })
// .flat()
// .map((nodeType) => {
//   return {
//     name: nodeType,
//   };
// });
export const getNodeTypes = () => {
  return nodeDefines.map((node) => {
    return {
      ...node,
      name: node.name,
    };
  });
};

export const nodeBehaviorCacheAll = async () => {
  const nodeTypes = nodeDefineMap;
  // loop through all node types
  for (const nodeType of Object.values(nodeTypes)) {
    if (nodeBehaviorCache[nodeType.name] === undefined) {
      nodeBehaviorCache[nodeType.name] = await getNodeBehavior(nodeType.name);
    }
  }

  // await Promise.all(
  //   // Object.keys(nodeTypes).forEach(async (nodeType) => {
  //   // nodeTypes.map(async (nodeType) => {
  //   //   if (nodeBehaviorCache[nodeType.name] === undefined) {
  //   //     nodeBehaviorCache[nodeType.name] = await getNodeBehavior(nodeType.name);
  //   //   }
  //   // }),

  // );
};
