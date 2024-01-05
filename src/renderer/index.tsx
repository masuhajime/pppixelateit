import { createRoot } from 'react-dom/client';
import Save from '@mui/icons-material/Save';
import App from './App';
import useNodeStore from '../store/store';
import useFileOpening from '../store/storeFileOpening';

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
// When Open from menu is clicked.
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
      if (!result.content) {
        // Display error or something
        return -1;
      }
      const parsed = JSON.parse(result.content);
      if (!parsed.nodes || !parsed.edges) {
        // Display error or something
        return -1;
      }
      useFileOpening.getState().setFilePathOpening(result.filePath);
      nodeStore.setPartialState(parsed);
      // TODO: set title window.
      window.mainWindow.titleSet(`${result.filePath}`);
      return 0;
    })
    .catch((err) => {
      console.error(err);
    });
});

window.electron.ipcRenderer.on('file-new', async (arg) => {
  const nodeStore = useNodeStore.getState();
  const { modified } = nodeStore;
  const fileOpening = useFileOpening.getState().getFilePathOpening();
  if (modified) {
    const selected = await window.dialog.showMessageBoxSync({
      type: 'info',
      title: 'Do you want to save changes?',
      message: `File not saved. Are you sure you want to create a new file?`,
      buttons: ['Save', "Don't Save", 'Cancel'],
      defaultId: 0,
      cancelId: 2,
    });
    // TODO: handle cancel/save/dont save
    console.log('file-new: not saved', {
      selected,
    });

    return;
  }
  useFileOpening.getState().setFilePathOpening(undefined);

  nodeStore.setPartialState({
    nodes: [],
    edges: [],
  });
});
