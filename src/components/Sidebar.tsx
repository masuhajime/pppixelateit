// @flow
import { Box, Card, CardContent, Typography, styled } from '@mui/material';
import path from 'path';
import { useState } from 'react';
import { getNodeTypes } from '../flows/nodes/data/NodeData';
import TextToIcon from './TextToIcon';

const nodeTypes = getNodeTypes();

const CardContentNoPadding = styled(CardContent)(`
  padding: 8px 16px;
  &:last-child {
    padding-bottom: 8px;
  }
`);

const CardStyled = styled(Card)(`
  transition-duration: 0ms;
`);

type Props = {};
export default function Sidebar(props: Props) {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const [debug, setDebug] = useState('');

  return (
    <div
      style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => {
          window.debug.debug().then((result: any) => {
            console.log('debug', result);
            setDebug(JSON.stringify(result, null, 2));
          });
        }}
      >
        debug
      </button>
      <p>{debug}</p>
      {nodeTypes.map((nodeType) => {
        return (
          <Box
            sx={{
              padding: '8px',
              marginBottom: '8px',
            }}
            key={nodeType.name}
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
                  <CardStyled
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
                        alignItems: 'center',
                      }}
                    >
                      <TextToIcon
                        icon={node.icon}
                        style={{
                          transitionDuration: '0',
                          marginRight: '8px',
                          color: nodeType.color,
                          fontSize: '1.0rem',
                        }}
                      />
                      {node.name}
                    </CardContentNoPadding>
                  </CardStyled>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </div>
  );
}
