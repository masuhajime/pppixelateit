import {
  ImageFlattenParameter,
  ImageOutlineParameter,
} from '../../main/process/dto';
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

export const handleSources: Record<string, HandleSource> = {
  image: handleSourceImageDefault,
};

export const handleTargets: Record<string, HandleTarget> = {
  image: {
    id: 'image',
    dataType: 'image',
  },
};

export type NodeData = {
  settings: {
    number?: number;
    lineSide?: string;
    r: number;
    g: number;
    b: number;
    a: number;
  };
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
    store.updateNodeData<NodeData>(nodeId, {
      imageBuffer: data,
      completed: false,
    });
    // if (this.canStartProcess(node.id)) {
    //   this.nodeProcess(node.id)
    // }
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
    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image or number');
    }

    window.imageProcess
      .imageProcess('imageFlatten', {
        buffer: node.data.imageBuffer.buffer,
        color: {
          r: Number.isInteger(node.data.settings.r)
            ? node.data.settings.r
            : 128,
          g: Number.isInteger(node.data.settings.g)
            ? node.data.settings.g
            : 128,
          b: Number.isInteger(node.data.settings.b)
            ? node.data.settings.b
            : 128,
          a: Number.isInteger(node.data.settings.a)
            ? node.data.settings.a
            : 255,
        },
      } as ImageFlattenParameter)
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
        console.error('OutlineNodeBehavior', err);
      });
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.imageBuffer?.buffer;
  },
};
