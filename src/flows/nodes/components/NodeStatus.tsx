/* eslint-disable import/prefer-default-export */
// @flow
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ModeStandbyIcon from '@mui/icons-material/ModeStandby';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { Box, Typography, keyframes } from '@mui/material';
import { NodeBaseData } from '../data/NodeData';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

type Props = {
  nodeData: NodeBaseData;
};
export function NodeStatus(props: Props) {
  const { nodeData } = props;
  return (
    <Box
      className="node-item"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* <Box>completed: {nodeData.completed ? 'true' : 'false'}</Box> */}
      {/* <PlayCircleIcon /> */}
      {/* <StopCircleIcon /> */}
      {nodeData.isProcessing && (
        <AutorenewIcon
          sx={{
            animation: `${spin} 2s linear infinite`,
          }}
        />
      )}
      {!nodeData.completed && !nodeData.isProcessing && <ModeStandbyIcon />}

      {nodeData.completed && (
        <CheckCircleOutlineIcon
          sx={{
            color: 'lightgreen',
          }}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'gray',
        }}
      >
        <TimerOutlinedIcon
          sx={{
            paddingRight: '4px',
          }}
        />
        <Typography variant="caption">
          {/** display process time in seconds */}
          {nodeData.processTime ? `${nodeData.processTime / 1000}s` : '-'}
        </Typography>
      </Box>
    </Box>
  );
}
