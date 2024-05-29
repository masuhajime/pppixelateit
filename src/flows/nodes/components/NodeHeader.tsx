// @flow
import { CardHeader, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import useNodeStore from '../../../store/store';

type Props = {
  title?: string;
  nodeId?: string;
};
export const NodeHeader = (props: Props) => {
  const { title, nodeId } = props;
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
      style={
        {
          //backgroundColor: '#f5f5f5',
        }
      }
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
