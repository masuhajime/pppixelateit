import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Box,
  IconButton,
  Snackbar,
  SnackbarContent,
  Stack,
  ThemeProvider,
  createTheme,
  keyframes,
  useMediaQuery,
} from '@mui/material';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  EdgeChange,
  EdgeTypes,
  NodeChange,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import Split from 'react-split';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallow } from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../components/Sidebar';
import 'reactflow/dist/style.css';
import useNodeStore, { RFState } from '../store/store';
import useProcessStore from '../store/processStore';
import { CustomEdge } from '../flows/edges/CustomEdge';
import processController from '../process/imageProcess';
import nodesEnabled from '../flows/nodesEnabled';
import useFileOpening, { FileOpeningState } from '../store/storeFileOpening';
import { useDebounceOneTime } from '../hooks/useDebounceOneTime';
import ThemedBackground from '../components/ThemedBackground';
import { getNodeBehavior } from '../flows/nodes/data/NodeData';
import { PreparedFlowsDialog } from '../components/PreparedFlowsDialog';
import { useShallow } from 'zustand/react/shallow';
import { SnackbarStacks } from '../components/SnackbarStacks';
import { SettingsDialog } from '../components/SettingsDialog';
import useConfigStore from '../store/configStore';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

function Flow(props) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const nodeTypes = useMemo(() => {
    return nodesEnabled;
  }, []);

  const init = useCallback(() => {
    console.log('init');
    useProcessStore.getState().reset();
    // processStore.subscribe((state) => {
    //   console.log('App: processStore in subscribe', state)
    // })

    console.log('backend listend: start');
  }, []);
  const { filePath } = useFileOpening(
    (state: FileOpeningState) => ({
      filePath: state.filePathOpening,
    }),
    shallow,
  );
  const {
    modified,
    nodes,
    edges,
    setInitialized,
    onNodesChange,
    onEdgesChange,
    onConnect,
    nodeAdd,
  } = useNodeStore(
    (state: RFState) => ({
      modified: state.modified,
      nodes: state.nodes,
      edges: state.edges,
      setInitialized: state.setInitialized,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      nodeAdd: state.nodeAdd,
    }),
    shallow,
  );

  const reactFlow = useReactFlow();

  const { initialized } = useNodeStore(
    useShallow((state) => ({ initialized: state.initialized })),
  );

  useEffect(() => {
    if (initialized) {
      // initialize complete
      console.log('App: initialized complete', {
        initialized,
      });
      reactFlow.fitView();
    } else {
      console.log('App: initialized waiting', {
        initialized,
      });
    }
  }, [initialized]);

  const [debounceDone, debounceOneTimeTouch] = useDebounceOneTime(50);
  useEffect(() => {
    if (debounceDone) {
      console.log('debounceDone', {
        debounceDone,
      });
      setInitialized(true);
    }
  }, [debounceDone, setInitialized]);

  useEffect(() => {
    window.mainWindow.titleSet(
      `${modified ? '*' : ''}${filePath || 'Untitled'}`,
    );
    console.log('App: useFileOpening.subscribe', {
      modified,
      filePath,
    });
  }, [modified, filePath]);

  // const updateNodeInternals = useUpdateNodeInternals();
  const onConnectCustom = useCallback(
    (params: any) => {
      console.log(params);
      params.data = {};
      params.type = 'custom';
      onConnect(params);

      console.log('onConnectCustom', params);
    },
    [onConnect],
  );
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance | undefined
  >(undefined);
  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      console.log('onDrop', event);

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        // x: event.clientX - reactFlowBounds.left,
        // y: event.clientY - reactFlowBounds.top,
        x: event.clientX,
        y: event.clientY,
      });
      let newNode = {
        id: `node-${type}-${uuidv4()}`,
        type,
        position,
        data: { settings: {} },
      };
      const behavior = await getNodeBehavior(type);
      if (behavior.initializeSettingsOnNodeCreate) {
        const settings = behavior.initializeSettingsOnNodeCreate();
        // newNode.data.settings = settings;
        newNode = {
          ...newNode,
          data: {
            ...newNode.data,
            settings,
          },
        };
      }
      console.log('initializeSettingsOnNodeCreate', newNode);
      nodeAdd(newNode);
    },
    [nodeAdd, reactFlowInstance],
  );

  const { processStatus } = useProcessStore(
    useShallow((state) => ({ processStatus: state.processStatus })),
  );

  return (
    <>
      <Panel position="bottom-right">
        <SnackbarStacks></SnackbarStacks>
      </Panel>
      <div
        style={{
          // width: '100vw',
          height: '100vh',
        }}
        className="reactflow-wrapper"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          minZoom={0.2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
          onNodesChange={(changes: NodeChange[]) => {
            debounceOneTimeTouch();
            onNodesChange(changes);
          }}
          onEdgesChange={(changes: EdgeChange[]) => {
            debounceOneTimeTouch();
            onEdgesChange(changes);
          }}
          isValidConnection={(connection: Connection) => {
            // console.log('isValidConnection', connection);
            // find nodes connected to target handle
            // const node = getNodeSnapshot<NodeData>(nodeId);
            if (
              connection.target === null ||
              connection.targetHandle === null
            ) {
              return false;
            }
            const connecteds = useNodeStore
              .getState()
              .getEdgesConnectedToNodeAndHandle(
                connection.target,
                connection.targetHandle,
              );
            // console.log('connecteds', {
            //   connection,
            //   connecteds,
            // });

            if (connecteds.length > 0) {
              return false;
            }
            if (
              connection.targetHandle === null ||
              connection.sourceHandle === null
            ) {
              return false;
            }
            return connection.targetHandle.includes(connection.sourceHandle);
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnect={onConnectCustom}
          proOptions={{
            hideAttribution: true,
          }}
          onDrop={(event: React.DragEvent<HTMLDivElement>) => {
            onDrop(event);
          }}
          onDragOver={onDragOver}
          onInit={(instance: ReactFlowInstance) => {
            console.log('flow loaded:', instance);
            init();
            setReactFlowInstance(instance);
          }}
          fitView
        >
          <Panel position="top-left">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(128,128,128,0.5)',
                  borderRadius: '50%',
                }}
              >
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    console.log('play');
                    processController.start();
                  }}
                  disabled={processStatus === 'processing'}
                >
                  {processStatus === 'processing' && (
                    <AutorenewIcon
                      sx={{
                        animation: `${spin} 2s linear infinite`,
                        color: '#29ADFF',
                      }}
                    />
                  )}
                  {processStatus !== 'processing' && (
                    <PlayArrowIcon
                      sx={{
                        color: '#FF004D',
                      }}
                    />
                  )}
                </IconButton>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'rgba(128,128,128,0.5)',
                  borderRadius: '50%',
                  marginLeft: '8px',
                }}
              >
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    processController.stop();
                  }}
                  disabled={processStatus !== 'processing'}
                >
                  <StopIcon />
                </IconButton>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'rgba(128,128,128,0.5)',
                  borderRadius: '50%',
                  marginLeft: '8px',
                }}
              >
                <IconButton
                  aria-label="settings"
                  onClick={() => {
                    // change all node preview to visible
                    if (useNodeStore.getState().nodes.length === 0) {
                      return;
                    }
                    const preview =
                      !!useNodeStore.getState().nodes[0].data?.settings
                        .enablePreview;
                    useNodeStore.getState().setAllNodeEnablePreview(!preview);
                  }}
                  disabled={processStatus === 'processing'}
                >
                  <VisibilityIcon />
                </IconButton>
              </Box>
              {/* <div>TODO: version</div> */}
            </Box>
          </Panel>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

function Main() {
  return (
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
      }}
    >
      <ThemedBackground>
        <Sidebar />
      </ThemedBackground>
      <ThemedBackground>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </ThemedBackground>
    </Split>
  );
}

function solveTheme(theme: string, prefersColorSchemeDark: boolean) {
  switch (theme) {
    case 'light':
      return false;
    case 'dark':
      return true;
    case 'system':
      return prefersColorSchemeDark;
  }
}

export default function App() {
  const prefersColorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setDarkMode] = React.useState(
    solveTheme(useConfigStore.getState().theme, prefersColorSchemeDark),
  );

  useConfigStore.subscribe(
    (state) => {
      return state.theme;
    },
    (theme) => {
      setDarkMode(solveTheme(theme, prefersColorSchemeDark));
    },
  );

  const theme = React.useMemo(() => {
    return createTheme({
      palette: {
        mode: isDarkMode ? 'dark' : 'light',
        background: {
          default: isDarkMode ? '#333333' : '#e8e8e8',
        },
      },
      components: {
        MuiIconButton: {
          defaultProps: {
            sx: {},
          },
        },
        MuiPaper: {
          defaultProps: {
            sx: {
              backgroundColor: isDarkMode ? '#181818' : '#f8f8f8',
            },
          },
        },
      },
    });
  }, [isDarkMode]);
  return (
    <ThemeProvider theme={theme}>
      <PreparedFlowsDialog />
      <SettingsDialog />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
