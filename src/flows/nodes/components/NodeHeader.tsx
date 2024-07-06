// @flow
import { CardHeader, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import useNodeStore from '../../../store/store';

type Props = {
  title?: string;
  nodeId?: string;
  color?: [number, number, number];
};
export const NodeHeader = (props: Props) => {
  const { title, nodeId, color } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <CardHeader
      title={title}
      titleTypographyProps={{ variant: 'h6' }}
      style={{
        padding: '8px 16px',
        backgroundColor: color
          ? `rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`
          : undefined,
        // gradient background
        backgroundImage: color
          ? `linear-gradient(135deg, rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.3), rgb(${color[0]}, ${color[1]}, ${color[2]}, 0.1))`
          : undefined,
      }}
      action={
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            className="nodrag"
            onClick={handleClick}
            sx={{
              boxShadow: 'none',
            }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            open={open}
            onClose={handleClose}
          >
            {!!nodeId && (
              <MenuItem
                sx={[
                  {
                    '&:hover': {
                      color: 'red',
                    },
                  },
                  {
                    display: 'flex',
                  },
                ]}
                onClick={() => {
                  useNodeStore.getState().nodeDelete(nodeId);
                  handleClose();
                }}
              >
                <DeleteIcon fontSize="small"></DeleteIcon>
              </MenuItem>
            )}
          </Menu>
        </>
      }
    ></CardHeader>
  );
};
