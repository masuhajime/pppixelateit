import { DialogHandler, ElectronHandler, FsHandler } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    fs: FsHandler;
    dialog: DialogHandler;
  }
}

export {};
