import { createRoot } from 'react-dom/client';
import Save from '@mui/icons-material/Save';
import { Buffer } from 'buffer';
import App from './App';
import useNodeStore from '../store/store';
import useFileOpening from '../store/storeFileOpening';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

const askSaveCurrentFile = async (): Promise<{
  file: string | undefined;
  canceled: boolean;
  trash: boolean;
}> => {
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
    switch (selected) {
      case 0: // save
        if (fileOpening) {
          const json = nodeStore.getPartialStateJsonString();
          // convert json string to buffer
          const buffer = Buffer.from(json);
          window.fs.saveAsBuffer(fileOpening, buffer);
          return {
            file: fileOpening,
            canceled: false,
            trash: false,
          };
        }
        {
          // new file
          const text = nodeStore.getPartialStateJsonString();
          const resultSaveAs = await window.fs.saveAs(text, {
            buttonLabel: 'Save as',
            filters: [],
          });
          console.log('resultSaveAs', resultSaveAs);
          if (!resultSaveAs) {
            // cancel
            return {
              file: undefined,
              canceled: true,
              trash: false,
            };
          }
          return {
            file: resultSaveAs,
            canceled: false,
            trash: false,
          };
        }
      case 1: // dont save
        return {
          file: undefined,
          canceled: false,
          trash: true,
        };
      default: // cancel
        return {
          file: undefined,
          canceled: true,
          trash: false,
        };
    }
  }
  // Not modified
  return {
    file: undefined,
    canceled: false,
    trash: true,
  };
};

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
