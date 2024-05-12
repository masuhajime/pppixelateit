import { createRoot } from 'react-dom/client';
import Save from '@mui/icons-material/Save';
import { Buffer } from 'buffer';
import App from './App';
import useNodeStore from '../store/store';
import useFileOpening from '../store/storeFileOpening';
import useConfigStore from '../store/configStore';
import askSaveCurrentFile from './dialogs/askSaveCurrentFile';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);

window.electron.ipcRenderer.on('file-save', (arg) => {
  const nodeStore = useNodeStore.getState();

  // get file path
  const fileOpening = useFileOpening.getState().getFilePathOpening();
  if (fileOpening) {
    const json = nodeStore.getPartialStateJsonString();
    // convert json string to buffer
    const buffer = Buffer.from(json);
    window.fs.saveAsBuffer(fileOpening, buffer);
    // set not modified
    nodeStore.setModified(false);
    return true;
  }

  const text = nodeStore.getPartialStateJsonString();
  window.fs
    .saveAs(text, {
      buttonLabel: 'Save as',
      filters: [],
    })
    .then((result) => {
      console.log('result', result);
      // set file path
      useFileOpening.getState().setFilePathOpening(result);
      // set not modified
      nodeStore.setModified(false);
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
  return true;
});

window.electron.ipcRenderer.on('file-save-as', (arg) => {
  const nodeStore = useNodeStore.getState();

  const text = nodeStore.getPartialStateJsonString();
  window.fs
    .saveAs(text, {
      buttonLabel: 'Save as',
      filters: [],
    })
    .then((result) => {
      console.log('result', result);
      // set file path
      useFileOpening.getState().setFilePathOpening(result);
      // set not modified
      nodeStore.setModified(false);
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
});
// When Open from menu is clicked.
window.electron.ipcRenderer.on('file-open', (arg) => {
  const nodeStore = useNodeStore.getState();

  askSaveCurrentFile()
    .then((resultA) => {
      if (resultA.trash || !!resultA.file) {
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
      }
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
});
window.electron.ipcRenderer.on('file-new', async (arg) => {
  askSaveCurrentFile()
    .then((result) => {
      const nodeStore = useNodeStore.getState();
      if (result.trash || !!result.file) {
        useFileOpening.getState().setFilePathOpening(undefined);

        nodeStore.setPartialState({
          nodes: [],
          edges: [],
        });
      }
      return true;
    })
    .catch((err) => {
      console.error(err);
    });
});

window.electron.ipcRenderer.on('file-new-template', async (arg) => {
  useConfigStore.getState().setOpenDialogPreparedFlows(true);
});
