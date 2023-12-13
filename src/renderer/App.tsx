import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Box, IconButton, ThemeProvider, createTheme } from '@mui/material';
import ReactFlow, {
  Background,
  Controls,
  EdgeChange,
  EdgeTypes,
  NodeChange,
  Panel,
  ReactFlowInstance,
  ReactFlowProvider,
} from 'reactflow';
import Split from 'react-split';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from '../components/Sidebar';
import 'reactflow/dist/style.css';
import useNodeStore, { RFState } from '../store/store';
import processStore from '../store/processStore';
import { CustomEdge } from '../flows/edges/CustomEdge';
import processController from '../process/imageProcess';
import nodesEnabled from '../flows/nodesEnabled';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiIconButton: {
      defaultProps: {
        sx: {},
      },
    },
  },
});
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

function Main() {
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

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, nodeAdd } =
    useNodeStore(
      (state: RFState) => ({
        nodes: state.nodes,
        edges: state.edges,
        onNodesChange: state.onNodesChange,
        onEdgesChange: state.onEdgesChange,
        onConnect: state.onConnect,
        nodeAdd: state.nodeAdd,
      }),
      shallow,
    );

  const onConnectCustom = useCallback(
    (params: any) => {
      console.log(params);
      params.data = {};
      params.type = 'custom';
      onConnect(params);
    },
    [onConnect],
  );
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
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
    <ThemeProvider theme={theme}>
      <ReactFlowProvider>
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
          <Sidebar />

          <div
            style={{ width: '100vw', height: '100vh' }}
            className="reactflow-wrapper"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={(changes: NodeChange[]) => {
                onNodesChange(changes);
              }}
              onEdgesChange={(changes: EdgeChange[]) => {
                onEdgesChange(changes);
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
        </Split>
      </ReactFlowProvider>
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
