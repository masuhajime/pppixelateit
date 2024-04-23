import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {
  Box,
  IconButton,
  ThemeProvider,
  createTheme,
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
  useUpdateNodeInternals,
} from 'reactflow';
import Split from 'react-split';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
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
import processStore from '../store/processStore';
import { CustomEdge } from '../flows/edges/CustomEdge';
import processController from '../process/imageProcess';
import nodesEnabled from '../flows/nodesEnabled';
import useFileOpening, { FileOpeningState } from '../store/storeFileOpening';
import { useDebounceOneTime } from '../hooks/useDebounceOneTime';
import ThemedBackground from '../components/ThemedBackground';

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
    processStore.getState().reset();
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

  const [debounceDone, debounceOneTimeTouch] = useDebounceOneTime(1000);
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
    (event: React.DragEvent<HTMLDivElement>) => {
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

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: `node-${type}-${uuidv4()}`,
        type,
        position,
        data: { settings: {} },
      };
      nodeAdd(newNode);
    },
    [nodeAdd, reactFlowInstance],
  );

  return (
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
          if (connection.target === null || connection.targetHandle === null) {
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
      >
        <Panel position="top-left">
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
            >
              <PlayArrowIcon />
            </IconButton>
          </Box>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

function Main() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(() => {
    const isDarkMode = prefersDarkMode;
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
      },
    });
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
