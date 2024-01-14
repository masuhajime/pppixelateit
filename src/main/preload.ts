// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  MessageBoxSyncOptions,
  OpenDialogOptions,
  SaveDialogOptions,
} from 'electron';

const imageProcessHandler = {
  imageProcess: async (method: string, value: any): Promise<Buffer> => {
    ipcRenderer.send('image-process', method, value);
    const buffer = await ipcRenderer.invoke('image-process', method, value);
    return buffer;
  },
};
contextBridge.exposeInMainWorld('imageProcess', imageProcessHandler);
export type ImageProcessHandler = typeof imageProcessHandler;

export type Channels =
  | 'ipc-example'
  | 'file-save'
  | 'file-save-as'
  | 'file-open'
  | 'file-new';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};
contextBridge.exposeInMainWorld('electron', electronHandler);
export type ElectronHandler = typeof electronHandler;

const fsHandler = {
  readAsBuffer: async (path: string) => {
    console.log('read-as-buffer', path);

    // ipcRenderer.invoke('read-as-buffer', path);
    const buffer = await ipcRenderer.invoke('read-as-buffer', path);
    // const result = await ipcRenderer.invoke('readAsBuffer', path);
    return buffer;
  },
  saveAsBuffer: async (path: string, buffer: Buffer) => {
    console.log('save-as-buffer', path);

    // ipcRenderer.invoke('save-as-buffer', path, buffer);
    await ipcRenderer.invoke('save-as-buffer', {
      path,
      buffer,
    });
  },
  saveAsText: async (path: string, buffer: Buffer) => {
    console.log('save-as-buffer', path);

    // ipcRenderer.invoke('save-as-buffer', path, buffer);
    await ipcRenderer.invoke('save-as-buffer', {
      path,
      buffer,
    });
  },
  async saveAs(
    string: string,
    option: SaveDialogOptions,
  ): Promise<undefined | string> {
    return ipcRenderer.invoke('file-save-as-handle', string, option);
  },
  async open(option: OpenDialogOptions): Promise<{
    filePath: string;
    content?: string;
  }> {
    return ipcRenderer.invoke('file-open-handle', option);
  },
  readDir(path: string) {
    // get all files in the directory
    return ipcRenderer.invoke('directory-read', path);
  },
};
contextBridge.exposeInMainWorld('fs', fsHandler);
export type FsHandler = typeof fsHandler;

const dialogHandler = {
  selectFile: async (option: OpenDialogOptions) => {
    const buffer = await ipcRenderer.invoke('dialog-select-file', option);
    return buffer;
  },
  showMessageBoxSync: (option: MessageBoxSyncOptions) => {
    return ipcRenderer.invoke('dialog-show-message-box-sync', option);
  },
};
contextBridge.exposeInMainWorld('dialog', dialogHandler);
export type DialogHandler = typeof dialogHandler;

const mainWindowHandler = {
  titleSet: async (title: string) => {
    ipcRenderer.invoke('title-set', title);
  },
};
contextBridge.exposeInMainWorld('mainWindow', mainWindowHandler);
export type MainWindowHandler = typeof mainWindowHandler;
