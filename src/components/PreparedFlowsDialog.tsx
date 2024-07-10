/* eslint-disable import/prefer-default-export */
import {
  Backdrop,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import * as React from 'react';
import Split from 'react-split';
import { useKeyPress } from '../hooks/useKeyPress';
import askSaveCurrentFile from '../renderer/dialogs/askSaveCurrentFile';
import useConfigStore from '../store/configStore';
import useNodeStore from '../store/store';
import useFileOpening from '../store/storeFileOpening';

const getTemplateNode = (
  name: string,
): Promise<{
  default: {
    nodes: any[];
    edges: any[];
  };
}> => {
  // switch (name) {
  //   case 'SimplePixelation':
  //     return SimplePixelation;
  //   // case 'betterPixelation':
  //   //   return betterPixelation;
  //   default:
  //     throw new Error(`Template not found:${name}`);
  // }
  // load template from file dynamically
  const template = import(`../assets/flows/${name}`);
  return template;
};

const templateList = [
  {
    title: 'Simple Pixelation',
    templateName: 'SimplePixelation',
    description: 'The simplest pixelation flow.',
  },
  {
    title: 'Simple Pixelation (Load image file)',
    templateName: 'SimplePixelationUseImage',
    description: 'The simplest pixelation flow load image file.',
  },
  {
    title: 'Better Pixelation',
    templateName: 'BetterPixelation',
    description:
      'A pixelation flow that reduces the number of colors and applies a blurring process.',
  },
  {
    title: 'Any size to 32x32 pixels',
    templateName: 'AnySizeTo32x32Pixels',
    description: 'An example of converting any size image to 32x32 pixels.',
  },
  {
    title: 'Add many outlines',
    templateName: 'AddManyOutlines',
    description: 'An example of adding many outlines to an image.',
  },
  {
    title: 'Apply color palette',
    templateName: 'ApplyColorPalette',
    description: 'An example of applying a color palette to an image.',
  },
  {
    title: 'Convert images in directory and save',
    templateName: 'ConvertImagesInDirectory',
    description:
      'An example of converting images in a directory and saving them.',
  },
];

const openTemplate = (name: string, handleClose: () => void) => {
  const applyTemplate = (nameOfTemplate: string) => {
    useFileOpening.getState().setFilePathOpening(undefined);
    return getTemplateNode(nameOfTemplate)
      .then((template) => {
        const { nodes, edges } = template.default;
        useNodeStore.getState().setPartialState({
          nodes,
          edges,
          initialized: false,
          modified: false,
        });
        handleClose();
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  };

  if (useNodeStore.getState().modified) {
    return askSaveCurrentFile()
      .then((result) => {
        if (!result.canceled) {
          return applyTemplate(name);
        }
        return false;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
  return applyTemplate(name);
};

export function PreparedFlowsDialog() {
  const [open, setOpen] = React.useState(false);

  useConfigStore.subscribe((state) => {
    if (state.openDialogPreparedFlows) {
      setOpen(true);
    } else if (!state.openDialogPreparedFlows) {
      setOpen(false);
    }
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

  const nodeStore = useNodeStore();

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
            Template Flows
          </Typography>
          <Split
            sizes={[25, 75]}
            minSize={10}
            expandToMin={false}
            gutterSize={8}
            gutterAlign="center"
            snapOffset={10}
            dragInterval={1}
            direction="horizontal"
            cursor="col-resize"
            style={{
              display: 'flex',
              flexDirection: 'row',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            <Box
              sx={{
                overflow: 'auto',
              }}
            >
              <ListItemButton>
                <ListItemText primary="All" />
              </ListItemButton>
              {/* <ListItemButton>
                <ListItemText primary="Pixelation" />
              </ListItemButton> */}
            </Box>
            <Box
              sx={{
                overflow: 'auto',
              }}
            >
              <List
                sx={{
                  width: '100%',
                }}
              >
                <Divider component="li" key="divider_first" />
                {templateList.map((item) => {
                  return (
                    <Box key={item.templateName}>
                      <ListItemButton
                        onClick={() => {
                          openTemplate(item.templateName, handleClose).then(
                            (result) => {
                              if (result) {
                                nodeStore.setInitialized(false);
                              }
                            },
                          );
                        }}
                      >
                        <ListItemText
                          primary={item.title}
                          secondary={
                            <Typography variant="caption">
                              {item.description}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                      <Divider component="li" />
                    </Box>
                  );
                })}
              </List>
            </Box>
          </Split>
        </Box>
      </Paper>
    </Backdrop>
  );
}
