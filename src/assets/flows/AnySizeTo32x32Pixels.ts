const flows = {
  nodes: [
    {
      id: 'node-ImageInputTestNode-d86dc44a-fc5f-4dd9-be68-484f4f635046',
      type: 'ImageInputTestNode',
      position: { x: -2788.8367720233127, y: -14.480739621989665 },
      data: { settings: { imageName: 'Tree' } },
      width: 240,
      height: 459,
      selected: false,
      dragging: false,
      positionAbsolute: { x: -2788.8367720233127, y: -14.480739621989665 },
    },
    {
      id: 'node-TrimTransparentNode-bbbb0bd5-8c1f-4047-877f-8946b02bddbb',
      type: 'TrimTransparentNode',
      position: { x: -2512.005147267606, y: -14.58001961465314 },
      data: { settings: {} },
      width: 240,
      height: 444,
      selected: false,
      positionAbsolute: { x: -2512.005147267606, y: -14.58001961465314 },
      dragging: false,
    },
    {
      id: 'node-ResizeToSideNode-407d74d8-4fce-465c-b2d6-fc70de692d3a',
      type: 'ResizeToSideNode',
      position: { x: -2234.8195116378174, y: -13.447036525529112 },
      data: { settings: { resizeBase: 'longer', size: 32, method: 'nearest' } },
      width: 226,
      height: 444,
      selected: false,
      positionAbsolute: { x: -2234.8195116378174, y: -13.447036525529112 },
      dragging: false,
    },
    {
      id: 'node-ExtendToAspectRatioNode-5e7f1638-f84b-4248-a77d-9b8a8725edf9',
      type: 'ExtendToAspectRatioNode',
      position: { x: -1965.6152798485298, y: -10.618804778892619 },
      data: { settings: { width: 1, height: 1 } },
      width: 256,
      height: 429,
      selected: true,
      positionAbsolute: { x: -1965.6152798485298, y: -10.618804778892619 },
      dragging: false,
    },
  ],
  edges: [
    {
      source: 'node-ImageInputTestNode-d86dc44a-fc5f-4dd9-be68-484f4f635046',
      sourceHandle: 'image',
      target: 'node-TrimTransparentNode-bbbb0bd5-8c1f-4047-877f-8946b02bddbb',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-ImageInputTestNode-d86dc44a-fc5f-4dd9-be68-484f4f635046image-node-TrimTransparentNode-bbbb0bd5-8c1f-4047-877f-8946b02bddbbimage',
    },
    {
      source: 'node-TrimTransparentNode-bbbb0bd5-8c1f-4047-877f-8946b02bddbb',
      sourceHandle: 'image',
      target: 'node-ResizeToSideNode-407d74d8-4fce-465c-b2d6-fc70de692d3a',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-TrimTransparentNode-bbbb0bd5-8c1f-4047-877f-8946b02bddbbimage-node-ResizeToSideNode-407d74d8-4fce-465c-b2d6-fc70de692d3aimage',
    },
    {
      source: 'node-ResizeToSideNode-407d74d8-4fce-465c-b2d6-fc70de692d3a',
      sourceHandle: 'image',
      target:
        'node-ExtendToAspectRatioNode-5e7f1638-f84b-4248-a77d-9b8a8725edf9',
      targetHandle: 'image',
      data: {},
      type: 'custom',
      id: 'reactflow__edge-node-ResizeToSideNode-407d74d8-4fce-465c-b2d6-fc70de692d3aimage-node-ExtendToAspectRatioNode-5e7f1638-f84b-4248-a77d-9b8a8725edf9image',
    },
  ],
};
export default flows;