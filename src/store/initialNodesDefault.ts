import { Edge, Node } from 'reactflow';

export const initialNodes = [
  {
    id: 'node-1',
    type: 'ImageInputNode',
    position: { x: 0, y: 100 },
    data: {
      settings: {},
    },
  },
  {
    id: 'resize',
    type: 'ResizeToSideNode',
    position: { x: 300, y: 100 },
    data: {
      settings: {},
    },
  },
] as Node[];
export const initialEdges = [] as Edge[];
