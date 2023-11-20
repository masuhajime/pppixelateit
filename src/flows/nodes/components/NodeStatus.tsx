/* eslint-disable import/prefer-default-export */
// @flow
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { Box } from '@mui/material';
import { NodeBaseData } from '../data/NodeData';

type Props = {
  nodeData: NodeBaseData;
};
export function NodeStatus(props: Props) {
  const { nodeData } = props;
  return (
    <Box className="node-item">
      <Box>completed: {nodeData.completed ? 'true' : 'false'}</Box>
      <PlayCircleIcon />
      <StopCircleIcon />
      <CheckCircleOutlineIcon
        sx={{
          color: 'lightgreen',
        }}
      />
      <TimerOutlinedIcon />
      {nodeData.processTime ? nodeData.processTime : '-'}
    </Box>
  );
}
