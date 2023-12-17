import { createRoot } from 'react-dom/client';
import App from './App';
import useNodeStore from '../store/store';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on('file-save-as', (arg) => {
  const nodeStore = useNodeStore.getState();

  const text = nodeStore.getPartialStateJsonString();
  window.fs.saveAs(text, {
    buttonLabel: 'Save as',
    filters: [],
  });
});
window.electron.ipcRenderer.on('file-open', (arg) => {
  const nodeStore = useNodeStore.getState();

  // const text = nodeStore.getPartialStateJsonString();
  // window.fs.saveAs(text, {
  //   buttonLabel: 'Save as',
  //   filters: [],
  // });
  window.fs
    .open({
      buttonLabel: 'Open',
      filters: [
        {
          name: 'Json',
          extensions: ['json'],
        },
      ],
    })
    .then((result) => {
      nodeStore.setPartialState(JSON.parse(result));
      return 0;
    })
    .catch((err) => {
      console.error(err);
    });
});

window.electron.ipcRenderer.on('file-new', (arg) => {
  const nodeStore = useNodeStore.getState();

  nodeStore.setPartialState({
    nodes: [],
    edges: [],
  });
});
