interface NodeDefineGroup {
  name: string;
  color: [number, number, number];
  nodes: { name: string; nameDisplay: string; icon?: string }[];
}

interface NodeDefine {
  name: string;
  nameDisplay: string;
  color: [number, number, number];
  icon?: string;
}

// Color palette
// https://lospec.com/palette-list/pico-8
const nodeDefines: NodeDefineGroup[] = [
  {
    name: 'Input Output',
    color: [255, 0, 77],
    nodes: [
      {
        name: 'ImageInputTestNode',
        nameDisplay: 'Test Image Input',
        icon: 'ImageIcon',
      },
      {
        name: 'ImageInputNode',
        nameDisplay: 'Image Input',
        icon: 'ImageIcon',
      },
      {
        name: 'ImageInputDirectoryNode',
        nameDisplay: 'Directory Input',
        icon: 'FolderIcon',
      },
      {
        name: 'SaveImageNode',
        nameDisplay: 'Save Image',
        icon: 'SaveIcon',
      },
    ],
  },
  {
    name: 'Filter',
    color: [41, 173, 255],
    nodes: [
      {
        name: 'KmeansNode',
        nameDisplay: 'Kmeans Filter',
        icon: 'PaletteIcon',
      },
      {
        name: 'ColorPaletteNode',
        nameDisplay: 'Color Palette',
        icon: 'PaletteIcon',
      },
      {
        name: 'ErodeNode',
        nameDisplay: 'Erode Filter',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'ClaheNode',
        nameDisplay: 'Clahe Filter',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'DenoiseNode',
        nameDisplay: 'Denoise Filter',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'RemoveEdgePixelNode',
        nameDisplay: 'Remove Edge Pixel',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'OutlineNode',
        nameDisplay: 'Outline Filter',
        icon: 'BorderOuterIcon',
      },
      // {
      //   name: 'RemoveBackgroundNode',
      //   icon: 'AutoFixHighIcon',
      // },
      {
        name: 'MaskNode',
        nameDisplay: 'Mask Filter',
        icon: 'LayersIcon',
      },
      {
        name: 'AlphaThreshouldFlattenNode',
        nameDisplay: 'Alpha Threshould Flatten',
        icon: 'OpacityIcon',
      },
      {
        name: 'AlphaFlattenNode',
        nameDisplay: 'Alpha Flatten',
        icon: 'OpacityIcon',
      },
      {
        name: 'FillWithColorNode',
        nameDisplay: 'Fill With Color',
        icon: 'FormatColorFillIcon',
      },
    ],
  },
  {
    name: 'Resize',
    color: [0, 228, 54],
    nodes: [
      {
        name: 'ResizeToSideNode',
        nameDisplay: 'Resize To Side',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'ExtendNode',
        nameDisplay: 'Extend',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'ExtendToAspectRatioNode',
        nameDisplay: 'Extend To Aspect Ratio',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'TrimTransparentNode',
        nameDisplay: 'Trim Transparent',
        icon: 'PhotoSizeSelectSmallIcon',
      },
    ],
  },
  {
    name: 'Preview',
    color: [255, 163, 0],
    nodes: [
      {
        name: 'ImagePreviewNode',
        nameDisplay: 'Image Preview',
        icon: 'VisibilityIcon',
      },
      {
        name: 'ImagePreviewCompare',
        nameDisplay: 'Image Preview Compare',
        icon: 'VisibilityIcon',
      },
      {
        name: 'DebugNode',
        nameDisplay: 'Debug',
        icon: 'VisibilityIcon',
      },
    ],
  },
  {
    name: 'Values',
    color: [192, 192, 192],
    nodes: [
      {
        name: 'TextAppendNode',
        nameDisplay: 'Text Append',
        icon: 'TextFieldsIcon',
      },
      {
        name: 'TextFileNameNode',
        nameDisplay: 'Text File Name',
        icon: 'TextFieldsIcon',
      },
      {
        name: 'DirectorySubMoveNode',
        nameDisplay: 'Directory Sub Move',
        icon: 'FolderIcon',
      },
      {
        name: 'NumberNode',
        nameDisplay: 'Number',
        icon: 'PinIcon',
      },
    ],
  },
  // {
  //   name: 'PosterizeNode',
  // },
  // {
  //   name: 'PixelateNode',
  // },
  // {
  //   name: 'Fill00ColorToTransparentNode',
  // },
  // {
  //   name: 'TestNode',
  // },
];
export default nodeDefines;

export const nodeDefineMap: { [key: string]: NodeDefine } = {};
nodeDefines.forEach((group) => {
  group.nodes.forEach((node) => {
    nodeDefineMap[node.name] = {
      name: node.name,
      nameDisplay: node.nameDisplay,
      color: group.color,
      icon: node.icon,
    };
  });
});

export const findNodeDefine = (name: string) => {
  return nodeDefineMap[name];
};
