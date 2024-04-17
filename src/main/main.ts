/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  OpenDialogOptions,
  SaveDialogOptions,
  MessageBoxSyncOptions,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import fs from 'fs';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    // autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

ipcMain.handle(
  'dialog-select-file',
  async (event, payload: OpenDialogOptions): Promise<string | null> => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const result = await dialog.showOpenDialog(mainWindow, payload);

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return result.filePaths[0];
  },
);

ipcMain.handle(
  'dialog-show-message-box-sync',
  async (event, payload: MessageBoxSyncOptions): Promise<number> => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const result = await dialog.showMessageBoxSync(mainWindow, payload);
    return result;
  },
);

ipcMain.handle('title-set', async (event, payload: string): Promise<null> => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  mainWindow.setTitle(payload);
  return null;
});

ipcMain.on('file-save', async () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  console.log('file-save from main');
  mainWindow.webContents.send('file-save');
});

ipcMain.on('file-save-as', async () => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  console.log('file-save-as from main');
  mainWindow.webContents.send('file-save-as');
});

ipcMain.handle(
  'file-save-as-handle',
  async (event, text: string, dialogOptions: SaveDialogOptions) => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const result = await dialog.showSaveDialog(mainWindow, dialogOptions);

    if (result.canceled || !result.filePath) {
      return undefined;
    }
    fs.writeFileSync(result.filePath, text);
    return result.filePath;
  },
);

ipcMain.on('file-new', async (event) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  console.log('file-new');
  mainWindow.webContents.send('file-new');
});

ipcMain.on('file-open', async (event, payload: any) => {
  if (!mainWindow) {
    throw new Error('"mainWindow" is not defined');
  }
  console.log('file-open', payload);
  mainWindow.webContents.send('file-open');
});
ipcMain.handle(
  'file-open-handle',
  async (event, text: string, dialogOptions: OpenDialogOptions) => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    const result = await dialog.showOpenDialog(mainWindow, dialogOptions);

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }
    return {
      filePath: result.filePaths[0],
      content: fs.readFileSync(result.filePaths[0], 'utf8'),
    };
  },
);

ipcMain.handle(
  'image-process',
  async (event, method: string, payload: any): Promise<Buffer> => {
    return import(`./process/${method}`)
      .then((module) => {
        return module
          .default(payload)
          .then((buffer: Buffer) => {
            // event.reply('image-process', method, buffer);
            return buffer;
          })
          .catch((err: any) => {
            console.log('processImage error: ', {
              method,
              payload,
              err,
            });
          });
      })
      .catch((err) => {
        console.log('processImage: Not found import file', method, err);
      });
  },
);

ipcMain.handle('read-as-buffer', async (event, payload: string) => {
  const buffer = fs.readFileSync(payload, null);
  // console.log('read-as-buffer', payload, buffer);

  return buffer;
});

ipcMain.handle(
  'save-as-buffer',
  async (
    event,
    payload: {
      path: string;
      buffer: Buffer;
    },
  ) => {
    console.log('save-as-buffer', payload);

    fs.writeFileSync(payload.path, payload.buffer);
  },
);

ipcMain.handle('directory-read', async (event, directoryPath: string) => {
  const files = fs.readdirSync(directoryPath);
  return files.filter((file) => {
    // filter only image file
    const ext = path.extname(file).toLowerCase();
    // check is directory
    const isDirectory = fs
      .statSync(path.join(directoryPath, file))
      .isDirectory();
    if (isDirectory) {
      return false;
    }
    return ['.gif', '.png', '.jpg', '.jpeg'].includes(ext);
  });
});

ipcMain.handle('debug-string', async () => {
  return {
    a: path.resolve(__dirname),
    b: __dirname,
    c: path.join(path.resolve(), 'assets/imgly/'),
  };
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
