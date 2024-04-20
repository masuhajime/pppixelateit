interface NodeDefineGroup {
  name: string;
  color: string;
  nodes: { name: string; icon?: string }[];
}

interface NodeDefine {
  name: string;
  color: string;
  icon?: string;
}

// Color palette
// https://lospec.com/palette-list/pico-8
const nodeDefines: NodeDefineGroup[] = [
  {
    name: 'Input Output',
    color: '#FF004D',
    nodes: [
      {
        name: 'ImageInputTestNode',
        icon: 'ImageIcon',
      },
      {
        name: 'ImageInputNode',
        icon: 'ImageIcon',
      },
      {
        name: 'ImageInputDirectoryNode',
        icon: 'FolderIcon',
      },
      {
        name: 'SaveImageNode',
        icon: 'SaveIcon',
      },
    ],
  },
  {
    name: 'Filter',
    color: '#29ADFF',
    nodes: [
      {
        name: 'KmeansNode',
        icon: 'PaletteIcon',
      },
      {
        name: 'ColorPaletteNode',
        icon: 'PaletteIcon',
      },
      {
        name: 'ErodeNode',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'ClaheNode',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'DenoiseNode',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'RemoveEdgePixelNode',
        icon: 'AutoFixHighIcon',
      },
      {
        name: 'OutlineNode',
        icon: 'BorderOuterIcon',
      },
      // {
      //   name: 'RemoveBackgroundNode',
      //   icon: 'AutoFixHighIcon',
      // },
      {
        name: 'MaskNode',
        icon: 'LayersIcon',
      },
      {
        name: 'AlphaThreshouldFlattenNode',
        icon: 'OpacityIcon',
      },
      {
        name: 'AlphaFlattenNode',
        icon: 'OpacityIcon',
      },
      {
        name: 'FillWithColorNode',
        icon: 'FormatColorFillIcon',
      },
    ],
  },
  {
    name: 'Resize',
    color: '#00E436',
    nodes: [
      {
        name: 'ResizeToSideNode',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'ExtendNode',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'ExtendToAspectRatioNode',
        icon: 'PhotoSizeSelectLargeIcon',
      },
      {
        name: 'TrimTransparentNode',
        icon: 'PhotoSizeSelectSmallIcon',
      },
    ],
  },
  {
    name: 'Preview',
    color: '#FFA300',
    nodes: [
      {
        name: 'ImagePreviewNode',
        icon: 'VisibilityIcon',
      },
      {
        name: 'ImagePreviewCompare',
        icon: 'VisibilityIcon',
      },
      {
        name: 'DebugNode',
        icon: 'VisibilityIcon',
      },
    ],
  },
  {
    name: 'Text',
    color: '#FFEC27',
    nodes: [
      {
        name: 'TextAppendNode',
        icon: 'TextFieldsIcon',
      },
      {
        name: 'TextFileNameNode',
        icon: 'TextFieldsIcon',
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
      color: group.color,
      icon: node.icon,
    };
  });
});

export const findNodeDefine = (name: string) => {
  return nodeDefineMap[name];
};
