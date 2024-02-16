// import imglyRemoveBackground from '@imgly/background-removal';
import path from 'path';
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
import { ImageRemoveBackgroundParameter } from '../../main/process/dto';
// import { ImageRemoveBackgroundParameter } from '../../main/process/dto';

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
    threshold?: number;
    algorithm?: string;
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
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const store = useNodeStore.getState();
    store.updateNodeData<NodeData>(nodeId, {
      completed: false,
    });
    const node = getNodeSnapshot<NodeData>(nodeId);
    // data.completed = true
    console.log('node process test:', node.id, node.type);

    if (!node.data.imageBuffer?.buffer) {
      throw new Error('no image data');
    }

    const blobBuffer = new Blob([node.data.imageBuffer.buffer], {
      type: 'image/png',
    });
    // imglyRemoveBackground(blobBuffer, {
    //   model: 'medium',
    //   debug: true,
    //   output: {
    //     format: 'image/png',
    //   },
    // })
    //   .then(async (blob: Blob) => {
    //     // The result is a blob encoded as PNG. It can be converted to an URL to be used as HTMLImage.src
    //     // const url = URL.createObjectURL(blob);
    //     const b = await blob.arrayBuffer();
    //     store.updateNodeData<NodeData>(nodeId, {
    //       completed: true,
    //       imageBuffer: {
    //         buffer: Buffer.from(b),
    //         end: true,
    //       },
    //     });
    //     propagateValue(nodeId, handleSources);
    //     callback();
    //     return true;
    //   })
    //   .catch((error: Error) => {
    //     console.error(error);
    //   });
    window.imageProcess
      .imageProcess('imageRemoveBackground', {
        buffer: node.data.imageBuffer.buffer,
        algorithm: node.data.settings.algorithm,
      } as ImageRemoveBackgroundParameter)
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
    return !!node.data.imageBuffer?.buffer;
  },
};
