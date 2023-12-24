// @flow
import { Box, Card, CardContent, Typography, styled } from '@mui/material';
import { getNodeTypes } from '../flows/nodes/data/NodeData';
import TextToIcon from './TextToIcon';

const nodeTypes = getNodeTypes();

const CardContentNoPadding = styled(CardContent)(`
  padding: 8px 16px;
  &:last-child {
    padding-bottom: 8px;
  }
`);

type Props = {};
export default function Sidebar(props: Props) {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {nodeTypes.map((nodeType) => {
        return (
          <Box
            sx={{
              padding: '8px',
              marginBottom: '8px',
            }}
          >
            <Typography variant="subtitle1">{nodeType.name}</Typography>
            {nodeType.nodes.map((node) => {
              return (
                <Box
                  draggable
                  onDragStart={(event) => onDragStart(event, node.name)}
                  sx={{
                    padding: '4px 8px 4px 4px',
                  }}
                  key={node.name}
                >
                  <Card
                    sx={{
                      cursor: 'grab',
                      padding: '0px',
                      margin: '0px 0px',
                      '&:hover': {
                        boxShadow: `0px 0px 1px 1px ${nodeType.color}`,
                      },
                    }}
                  >
                    <CardContentNoPadding
                      sx={{
                        display: 'flex',
                      }}
                    >
                      <TextToIcon
                        icon={node.icon}
                        style={{
                          marginRight: '8px',
                          color: nodeType.color,
                        }}
                      />
                      {node.name}
                    </CardContentNoPadding>
                  </Card>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </div>
  );
}
