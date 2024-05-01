import { AlphaFlattenNode } from './nodes/AlphaFlattenNode';
import { AlphaThreshouldFlattenNode } from './nodes/AlphaThreshouldFlattenNode';
import { CallSharpNode } from './nodes/CallSharpNode';
import { ClaheNode } from './nodes/ClaheNode';
import { DebugNode } from './nodes/DebugNode';
import { DenoiseNode } from './nodes/DenoiseNode';
import { ErodeNode } from './nodes/ErodeNode';
import { Fill00ColorToTransparentNode } from './nodes/Fill00ColorToTransparentNode';
import { FillWithColorNode } from './nodes/FillWithColorNode';
import { ImageInputDirectoryNode } from './nodes/ImageInputDirectoryNode';
import { ImageInputTestNode } from './nodes/ImageInputTestNode';
import { ImageInputNode } from './nodes/ImageInputNode';
import { ImagePreviewCompare } from './nodes/ImagePreviewCompare';
import { ImagePreviewNode } from './nodes/ImagePreviewNode';
import { KmeansNode } from './nodes/KmeansNode';
import { MaskNode } from './nodes/MaskNode';
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
import { TrimTransparentNode } from './nodes/TrimTransparentNode';
import { ExtendNode } from './nodes/ExtendNode';
import { ExtendToAspectRatioNode } from './nodes/ExtendToAspectRatioNode';
import { ColorPaletteNode } from './nodes/ColorPaletteNode';
import { DirectorySubMoveNode } from './nodes/DirectorySubMoveNode';
import { NumberNode } from './nodes/NumberNode';

const nodesEnabled = {
  ImageInputTestNode,
  ImageInputNode,
  ResizeToSideNode,
  KmeansNode,
  ErodeNode,
  ClaheNode,
  DenoiseNode,
  ImageInputDirectoryNode,
  TextAppendNode,
  TextFileNameNode,
  WhiteToBlackNode,
  ImagePreviewNode,
  PosterizeNode,
  PixelateNode,
  Fill00ColorToTransparentNode,
  TestNode,
  FillWithColorNode,
  RemoveEdgePixelNode,
  OutlineNode,
  ImagePreviewCompare,
  SaveImageNode,
  RemoveBackgroundNode,
  CallSharpNode,
  MaskNode,
  DebugNode,
  AlphaThreshouldFlattenNode,
  AlphaFlattenNode,
  TrimTransparentNode,
  ExtendNode,
  ExtendToAspectRatioNode,
  ColorPaletteNode,
  DirectorySubMoveNode,
  NumberNode,
};
export default nodesEnabled;
