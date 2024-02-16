import {
  DebugHandler,
  DialogHandler,
  ElectronHandler,
  FsHandler,
  ImageProcessHandler,
  MainWindowHandler,
} from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    fs: FsHandler;
    dialog: DialogHandler;
    imageProcess: ImageProcessHandler;
    mainWindow: MainWindowHandler;
    debug: DebugHandler;
  }
}

export {};
