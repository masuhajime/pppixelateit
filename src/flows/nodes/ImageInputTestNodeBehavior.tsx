import { Buffer } from 'buffer';
import useNodeStore, {
  getNodeSnapshot,
  handleSourceImageDefault,
  propagateValue,
} from '../../store/store';
import {
  NodeBaseData,
  NodeBaseDataImageBuffer,
  NodeBehaviorInterface,
} from './data/NodeData';
import imageTestApple from '../../assets/imageTestApple';
import { base64ToBuffer } from '../../libs/buffer';
import imageTestGirlA from '../../assets/imageTestGirlA';
import imageTestSphere from '../../assets/imageTestSphere';
import imageTestHorse from '../../assets/imageTestHorse';
import imageTestTree from '../../assets/imageTestTree';
import imageTestPortion from '../../assets/imageTestPortion';
import imageTestBuildingFacade from '../../assets/imageTestBuildingFacade';
import imageTestBuildingIsometric from '../../assets/imageTestBuildingIsometric';
import imageTestGirlB from '../../assets/imageTestGirlB';
import imageTestDarkForest from '../../assets/imageTestDarkForest';
import imageTestWhiteClouds from '../../assets/imageTestWhiteClouds';
import imageTestGradient from '../../assets/imageTestGradient';
import imageTestGradientWB from '../../assets/imageTestGradientWB';

export const getImageBufferForImageInputTest = (imageName?: string): Buffer => {
  switch (imageName) {
    case 'Apple':
      return base64ToBuffer(imageTestApple);
    case 'Sphere':
      return base64ToBuffer(imageTestSphere);
    case 'Horse':
      return base64ToBuffer(imageTestHorse);
    case 'Tree':
      return base64ToBuffer(imageTestTree);
    case 'Potion':
      return base64ToBuffer(imageTestPortion);
    case 'BuildingFacade':
      return base64ToBuffer(imageTestBuildingFacade);
    case 'BuildingIsometric':
      return base64ToBuffer(imageTestBuildingIsometric);
    case 'GirlA':
      return base64ToBuffer(imageTestGirlA);
    case 'GirlB':
      return base64ToBuffer(imageTestGirlB);
    case 'DarkForest':
      return base64ToBuffer(imageTestDarkForest);
    case 'WhiteClouds':
      return base64ToBuffer(imageTestWhiteClouds);
    case 'GradientWB':
      return base64ToBuffer(imageTestGradientWB);
    case 'Gradient':
      return base64ToBuffer(imageTestGradient);
    default:
      throw new Error(`unknown image:${imageName}`);
  }
};

export type NodeData = {
  settings: {
    imageName?: string;
  };
} & NodeBaseData &
  NodeBaseDataImageBuffer;

export const handleSources = {
  image: handleSourceImageDefault,
};

export const nodeBehavior: NodeBehaviorInterface = {
  initialize(nodeId: string): void {
    // useNodeStore.getState().updateNodeData<NodeData>(nodeId, {
    //   // inputFilePath: '/Users/masuhajime/pppjs/images/5-3.png',
    //   inputFilePath: '/Users/masuhajime/pppjs/images/2-1-a.png',
    // });
  },
  dataIncoming(
    nodeId: string,
    handleId: string,
    dataType: string,
    data: any,
  ): void {
    throw new Error(`node process: should not be incoming: ${nodeId}`);
  },
  nodeProcess(nodeId: string, callback: () => void): void {
    const node = getNodeSnapshot<NodeData>(nodeId);

    const nodeStore = useNodeStore.getState();

    // base64 imageTestApple to buffer
    console.log('imageTestApple', node.data.settings.imageName, imageTestApple);

    nodeStore.updateNodeData<NodeData>(nodeId, {
      imageBuffer: {
        buffer: getImageBufferForImageInputTest(node.data.settings.imageName),
        end: true,
      },
      completed: true,
    });
    propagateValue(nodeId, handleSources);
    callback();
  },
  canStartProcess(nodeId: string): boolean {
    const node = getNodeSnapshot<NodeData>(nodeId);
    return !!node.data.settings.imageName;
  },
};
