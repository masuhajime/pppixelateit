/* eslint-disable import/prefer-default-export */
// @flow
import { Box, Card } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { keyframes } from '@mui/system';
import * as React from 'react';

type Props = {
  children: React.ReactNode;
  status?: 'processing' | 'waiting' | 'editing';
  colorBorder?: [number, number, number];
  displayBorder?: boolean;
};
export function Node(props: Props) {
  const editable = props.status === undefined || props.status === 'editing';
  return (
    <Card
      sx={{
        maxWidth: 256,
        opacity: editable ? 1 : 0.5,
        // border: `1px solid ${props.colorBorder || 'black'}`,
        borderColor:
          !!props.colorBorder && !!props.displayBorder
            ? `rgba(${props.colorBorder[0]}, ${props.colorBorder[1]}, ${props.colorBorder[2]}, 0.5)`
            : `rgba(0, 0, 0, 0)`,
        borderWidth: !!props.colorBorder && !!props.displayBorder ? 1 : 0,
        borderStyle: 'solid',
        margin: !!props.colorBorder && !!props.displayBorder ? '-1px' : 0,
      }}
    >
      {!editable && (
        <Box
          sx={{
            position: 'absolute',
            width: 'calc(100%)',
            height: 'calc(100%)',
            zIndex: 100,
          }}
        >
          {props.status === 'processing' ? processing() : null}
        </Box>
      )}
      <Box
        sx={{
          overflow: 'visible',
        }}
      >
        {props.children}
      </Box>
    </Card>
  );
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const processing = () => {
  return (
    <Box>
      <AutorenewIcon
        sx={{
          position: 'absolute',
          top: 'calc(35%)',
          left: 'calc(35%)',
          // set size
          width: 'calc(30%)',
          height: 'calc(30%)',
          animation: `${spin} 2s infinite linear`,
        }}
      />
    </Box>
  );
};
