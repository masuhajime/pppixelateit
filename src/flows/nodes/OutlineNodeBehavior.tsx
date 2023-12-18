import { ImageOutlineParameter } from '../../main/process/dto';
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
    number?: string;
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
    if (!node.data.imageBuffer?.buffer || !node.data.settings.number) {
      throw new Error('no image or number');
    }

    window.imageProcess
      .imageProcess('imageOutline', {
        buffer: node.data.imageBuffer.buffer,
        pixelCountAround: node.data.settings.number,
        lineSide: node.data.settings.lineSide,
        outlineColor: {
          r: node.data.settings.r,
          g: node.data.settings.g,
          b: node.data.settings.b,
          a: node.data.settings.a,
        },
      } as ImageOutlineParameter)
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
    return !!node.data.imageBuffer?.buffer && !!node.data.settings.number;
  },
};
