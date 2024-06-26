import { Handle, NodeProps, Position } from 'reactflow';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CardHeader, IconButton } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { NodeData, handleTargets } from './ImagePreviewNodeBehavior';
import { ImagePreview } from './items/ImagePreview';
import useNodeStore from '../../store/store';

export function ImagePreviewNode({ id, data }: NodeProps<NodeData>) {
  return (
    <Card
      sx={{
        maxWidth: 256, // TODO: 幅は適当です
      }}
    >
      <CardHeader
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Image Preview"
      />
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
    </Card>
  );
}
