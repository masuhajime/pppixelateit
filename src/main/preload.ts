// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent,
  OpenDialogOptions,
} from 'electron';

export type Channels = 'ipc-example';

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
};
contextBridge.exposeInMainWorld('fs', fsHandler);
export type FsHandler = typeof fsHandler;

const dialogHandler = {
  selectFile: async (option: OpenDialogOptions) => {
    const buffer = await ipcRenderer.invoke('dialog-select-file', option);
    return buffer;
  },
};
contextBridge.exposeInMainWorld('dialog', dialogHandler);
export type DialogHandler = typeof dialogHandler;
