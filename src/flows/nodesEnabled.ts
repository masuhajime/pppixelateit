import { CallSharpNode } from './nodes/CallSharpNode';
import { ErodeNode } from './nodes/ErodeNode';
import { Fill00ColorToTransparentNode } from './nodes/Fill00ColorToTransparentNode';
import { FillWithColorNode } from './nodes/FillWithColorNode';
import { ImageInputDirectoryNode } from './nodes/ImageInputDirectoryNode';
import { ImageInputNode } from './nodes/ImageInputNode';
import { ImagePreviewCompare } from './nodes/ImagePreviewCompare';
import { ImagePreviewNode } from './nodes/ImagePreviewNode';
import { KmeansNode } from './nodes/KmeansNode';
import { OutlineNode } from './nodes/OutlineNode';
import { PixelateNode } from './nodes/PixelateNode';
import { PosterizeNode } from './nodes/PosterizeNode';
import { RemoveBackgroundNode } from './nodes/RemoveBackgroundNode';
import { RemoveEdgePixelNode } from './nodes/RemoveEdgePixelNode';
import { ResizeToSideNode } from './nodes/ResizeToSideNode';
import { SaveImageNode } from './nodes/SaveImageNode';
import { TestNode } from './nodes/TestNode';
import { TextAppendNode } from './nodes/TextAppendNode';
import { TextFileNameNode } from './nodes/TextFileNameNode';
import { WhiteToBlackNode } from './nodes/WhiteToBlackNode';

const nodesEnabled = [
  {
    element: ImageInputNode,
  },
  {
    element: ResizeToSideNode,
  },
  {
    element: KmeansNode,
  },
  {
    element: ErodeNode,
  },
  {
    element: ImageInputDirectoryNode,
  },
  {
    element: TextAppendNode,
  },
  {
    element: TextFileNameNode,
  },
  {
    element: WhiteToBlackNode,
  },
  {
    element: ImagePreviewNode,
  },
  {
    element: PosterizeNode,
  },
  {
    element: PixelateNode,
  },
  {
    element: Fill00ColorToTransparentNode,
  },
  {
    element: TestNode,
  },
  {
    element: FillWithColorNode,
  },
  {
    element: RemoveEdgePixelNode,
  },
  {
    element: OutlineNode,
  },
  {
    element: ImagePreviewCompare,
  },
  {
    element: SaveImageNode,
  },
  {
    element: RemoveBackgroundNode,
  },
  {
    element: CallSharpNode,
  },
];
export default nodesEnabled;

export const getNodeTypesForReactFlow = () => {
  const nodeTypes: { [k: string]: any } = {};
  nodesEnabled.forEach((node) => {
    nodeTypes[node.element.name] = node.element;
  });
  return nodeTypes;
};
