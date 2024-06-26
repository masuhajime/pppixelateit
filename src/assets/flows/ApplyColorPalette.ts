const flows = {
  nodes: [
    {
      id: 'node-ResizeToSideNode-589fbfc6-bf61-4593-a0bb-f8757e435ef0',
      type: 'ResizeToSideNode',
      position: { x: 735.2481069064852, y: 535.9201435209467 },
      data: { settings: { resizeBase: 'width', size: 64, method: 'nearest' } },
      width: 226,
      height: 477,
      selected: false,
      positionAbsolute: { x: 735.2481069064852, y: 535.9201435209467 },
      dragging: false,
    },
    {
      id: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      type: 'OutlineNode',
      position: { x: 1208.3494103366772, y: 537.0848542862057 },
      data: {
        settings: {
          lineSide: 'inner',
          number: 'optimized',
          r: 75,
          g: 48,
          b: 23,
          a: 255,
        },
      },
      width: 195,
      height: 482,
      selected: false,
      positionAbsolute: { x: 1208.3494103366772, y: 537.0848542862057 },
      dragging: false,
    },
    {
      id: 'node-KmeansNode-80243577-80dc-4d8c-91f7-613b36c6ad8d',
      type: 'KmeansNode',
      position: { x: 998.1277844156054, y: 535.1167693175516 },
      data: { settings: { number: 12 } },
      width: 177,
      height: 365,
      selected: false,
      positionAbsolute: { x: 998.1277844156054, y: 535.1167693175516 },
      dragging: false,
    },
    {
      id: 'node-DenoiseNode-80ff5737-805f-4b9d-8cfb-5b2f1ad22b74',
      type: 'DenoiseNode',
      position: { x: 463.11368714046375, y: 533.8385472481934 },
      data: { settings: { pattern: 'median_5' } },
      width: 240,
      height: 509,
      selected: false,
      positionAbsolute: { x: 463.11368714046375, y: 533.8385472481934 },
      dragging: false,
    },
    {
      id: 'node-ImageInputTestNode-014fb092-f4d3-4645-85f8-01fafcf7e733',
      type: 'ImageInputTestNode',
      position: { x: 168.82020358113982, y: 534.1704277832475 },
      data: { settings: { imageName: 'Apple' } },
      width: 240,
      height: 459,
      selected: false,
      positionAbsolute: { x: 168.82020358113982, y: 534.1704277832475 },
      dragging: false,
    },
    {
      id: 'node-ColorPaletteNode-992a9f1d-2aaf-4a38-9e49-d063b1572373',
      type: 'ColorPaletteNode',
      position: { x: 1484.853852249689, y: 312.78852546043225 },
      data: { settings: { paletteName: 'LOSPEC500' } },
      width: 171,
      height: 365,
      selected: false,
      positionAbsolute: { x: 1484.853852249689, y: 312.78852546043225 },
      dragging: false,
    },
    {
      id: 'node-ColorPaletteNode-eec9a848-7714-4d7e-bc4a-4c108fce3442',
      type: 'ColorPaletteNode',
      position: { x: 1478.4576952664465, y: 712.5563723233632 },
      data: { settings: { paletteName: '1BitMonitorGLOW' } },
      width: 210,
      height: 365,
      selected: true,
      positionAbsolute: { x: 1478.4576952664465, y: 712.5563723233632 },
      dragging: false,
    },
    {
      id: 'node-ColorPaletteNode-8d06eba1-c023-4b58-ab03-b0120a5f71f2',
      type: 'ColorPaletteNode',
      position: { x: 1490.12533678899, y: 1118.7114978598686 },
      data: { settings: { paletteName: 'MidnightAblaze' } },
      width: 190,
      height: 365,
      selected: false,
      positionAbsolute: { x: 1490.12533678899, y: 1118.7114978598686 },
      dragging: false,
    },
    {
      id: 'node-ColorPaletteNode-4c23c399-182b-429d-8d7f-be5c667f2887',
      type: 'ColorPaletteNode',
      position: { x: 1733.7470410901274, y: 589.9708670015235 },
      data: { settings: { paletteName: 'SWEETIE16' } },
      width: 169,
      height: 365,
      selected: false,
      positionAbsolute: { x: 1733.7470410901274, y: 589.9708670015235 },
      dragging: false,
    },
    {
      id: 'node-ColorPaletteNode-25d89114-9a90-4113-9664-fec3b1963aa4',
      type: 'ColorPaletteNode',
      position: { x: 1738.0531057149176, y: 987.564167357093 },
      data: { settings: { paletteName: 'oil6' } },
      width: 164,
      height: 365,
      selected: false,
      positionAbsolute: { x: 1738.0531057149176, y: 987.564167357093 },
      dragging: false,
    },
  ],
  edges: [
    {
      source: 'node-ResizeToSideNode-589fbfc6-bf61-4593-a0bb-f8757e435ef0',
      sourceHandle: 'image',
      target: 'node-KmeansNode-80243577-80dc-4d8c-91f7-613b36c6ad8d',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-ResizeToSideNode-589fbfc6-bf61-4593-a0bb-f8757e435ef0image-node-KmeansNode-80243577-80dc-4d8c-91f7-613b36c6ad8dimage',
      selected: false,
    },
    {
      source: 'node-KmeansNode-80243577-80dc-4d8c-91f7-613b36c6ad8d',
      sourceHandle: 'image',
      target: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-KmeansNode-80243577-80dc-4d8c-91f7-613b36c6ad8dimage-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image',
      selected: false,
    },
    {
      source: 'node-DenoiseNode-80ff5737-805f-4b9d-8cfb-5b2f1ad22b74',
      sourceHandle: 'image',
      target: 'node-ResizeToSideNode-589fbfc6-bf61-4593-a0bb-f8757e435ef0',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-DenoiseNode-80ff5737-805f-4b9d-8cfb-5b2f1ad22b74image-node-ResizeToSideNode-589fbfc6-bf61-4593-a0bb-f8757e435ef0image',
      selected: false,
    },
    {
      source: 'node-ImageInputTestNode-014fb092-f4d3-4645-85f8-01fafcf7e733',
      sourceHandle: 'image',
      target: 'node-DenoiseNode-80ff5737-805f-4b9d-8cfb-5b2f1ad22b74',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-ImageInputTestNode-014fb092-f4d3-4645-85f8-01fafcf7e733image-node-DenoiseNode-80ff5737-805f-4b9d-8cfb-5b2f1ad22b74image',
    },
    {
      source: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      sourceHandle: 'image',
      target: 'node-ColorPaletteNode-eec9a848-7714-4d7e-bc4a-4c108fce3442',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image-node-ColorPaletteNode-eec9a848-7714-4d7e-bc4a-4c108fce3442image',
    },
    {
      source: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      sourceHandle: 'image',
      target: 'node-ColorPaletteNode-992a9f1d-2aaf-4a38-9e49-d063b1572373',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image-node-ColorPaletteNode-992a9f1d-2aaf-4a38-9e49-d063b1572373image',
    },
    {
      source: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      sourceHandle: 'image',
      target: 'node-ColorPaletteNode-8d06eba1-c023-4b58-ab03-b0120a5f71f2',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image-node-ColorPaletteNode-8d06eba1-c023-4b58-ab03-b0120a5f71f2image',
    },
    {
      source: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      sourceHandle: 'image',
      target: 'node-ColorPaletteNode-25d89114-9a90-4113-9664-fec3b1963aa4',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image-node-ColorPaletteNode-25d89114-9a90-4113-9664-fec3b1963aa4image',
    },
    {
      source: 'node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36',
      sourceHandle: 'image',
      target: 'node-ColorPaletteNode-4c23c399-182b-429d-8d7f-be5c667f2887',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-OutlineNode-607afee6-10ad-436c-9527-672b9724fc36image-node-ColorPaletteNode-4c23c399-182b-429d-8d7f-be5c667f2887image',
    },
  ],
};
export default flows;
