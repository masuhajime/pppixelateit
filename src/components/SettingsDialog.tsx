/* eslint-disable import/prefer-default-export */
import {
  Backdrop,
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { useKeyPress } from '../hooks/useKeyPress';
import useConfigStore, { ConfigThemeType } from '../store/configStore';

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false);

  const [configs, setConfigs] = React.useState({
    theme: 'system',
  });

  useConfigStore.subscribe((state) => {
    if (state.openDialogSettings) {
      setOpen(true);
    } else if (!state.openDialogSettings) {
      setOpen(false);
    }
    setConfigs({
      theme: state.theme,
    });
  });

  const handleClose = () => {
    setOpen(false);
  };
  useKeyPress({
    keyPressItems: [
      {
        keys: ['Escape'],
        event: () => {
          handleClose();
        },
      },
    ],
  });

  if (!open) {
    return null;
  }

  return (
    <Backdrop
      sx={{ zIndex: (themea) => themea.zIndex.drawer + 1 }}
      open={open}
      onClick={handleClose}
      role="button"
      tabIndex={0}
    >
      <Paper
        elevation={12}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Box
          sx={{
            width: '80vw',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" component="div" sx={{ p: 2 }}>
            Settings
          </Typography>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                pb: 1,
              }}
            >
              Theme
            </Typography>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="theme-select-label">Theme</InputLabel>
                <Select
                  labelId="theme-select-label"
                  id="theme-select"
                  value={configs.theme}
                  label="Theme"
                  onChange={(e) => {
                    console.log(e.target.value);
                    // check if e.target.value is string
                    if (typeof e.target.value !== 'string') {
                      return;
                    }
                    useConfigStore
                      .getState()
                      .setTheme(e.target.value as ConfigThemeType);
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Backdrop>
  );
}
