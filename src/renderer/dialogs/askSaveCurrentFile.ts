import useNodeStore from '../../store/store';
import useFileOpening from '../../store/storeFileOpening';

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
export default askSaveCurrentFile;
