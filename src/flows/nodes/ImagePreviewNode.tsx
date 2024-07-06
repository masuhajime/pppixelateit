import { Handle, NodeProps, Position } from 'reactflow';

import CardContent from '@mui/material/CardContent';
import useNodeStore from '../../store/store';
import { NodeData, handleTargets } from './ImagePreviewNodeBehavior';
import { NodeBasic } from './components/NodeBasic';
import { ImagePreview } from './items/ImagePreview';

export function ImagePreviewNode({ id, data, selected }: NodeProps<NodeData>) {
  return (
    <NodeBasic
      id={id}
      nodeName="ImagePreviewNode"
      status={data.isProcessing ? 'processing' : undefined}
      displayBorder={selected}
    >
      <CardContent>
        <ImagePreview
          enabled={data.settings.enablePreview}
          completed={!!data.completed}
          imageBuffer={data.imageBuffer?.buffer}
          onTogglePreview={(enabled: boolean) => {
            useNodeStore.getState().updateNodeSetting(id, {
              enablePreview: enabled,
            });
          }}
        />
      </CardContent>
      <Handle
        type="target"
        id={handleTargets.image.id}
        isValidConnection={(connection) => {
          return true;
        }}
        onConnect={(params) => console.log('handle onConnect', id, params)}
        position={Position.Left}
        style={{
          right: -8,
          background: 'OrangeRed',
          width: 16,
          height: 16,
        }}
      />
    </NodeBasic>
  );
}
