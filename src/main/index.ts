import {app, BrowserWindow, dialog} from 'electron';
import path from 'path';

import reportExceptions from './features/reportExceptions.js';
import windowWrapper from './windowWrapper.js';
import {enforceSingleInstance, restoreFirstInstance} from './features/singleInstance.js';
import environment from "../environment.js";
import enableContextMenu from './features/contextMenu.js';
import runAtLogin from './features/openAtLogin.js';
import updateNotifier from './features/appUpdates.js';
import setupTrayIcon from './features/trayIcon.js';
import keepWindowState from './features/windowState.js';
import externalLinks from './features/externalLinks.js';
import badgeIcons from './features/badgeIcon.js';
import closeToTray from './features/closeToTray.js';
import setAppMenu from './features/appMenu.js';
import overrideUserAgent from './features/userAgent.js';
import setupOfflineHandlers, {checkForInternet} from './features/inOnline.js';
import logFirstLaunch from './features/firstLaunch.js';
import handleNotification from './features/handleNotification.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;
let trayIcon = null;

// Features
reportExceptions();

// Handle macOS app location enforcement
const enforceMacOSAppLocation = async () => {
  if (process.platform === 'darwin' && !app.isInApplicationsFolder()) {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Move to Applications', 'Do Not Move'],
      message: 'Move to Applications folder?',
      detail: 'Running from the Applications folder is more secure and ensures proper updates.',
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      app.moveToApplicationsFolder();
    }
  }
};

if (enforceSingleInstance()) {
  app.whenReady()
    .then(async () => {
      overrideUserAgent();
      mainWindow = windowWrapper(environment.appUrl);
      setupOfflineHandlers(mainWindow);
      checkForInternet(mainWindow);

      trayIcon = setupTrayIcon(mainWindow);
      logFirstLaunch();
      setAppMenu(mainWindow);
      restoreFirstInstance(mainWindow);
      keepWindowState(mainWindow);
      runAtLogin(mainWindow);
      updateNotifier();
      enableContextMenu();
      badgeIcons(mainWindow, trayIcon);
      closeToTray(mainWindow);
      externalLinks(mainWindow);
      handleNotification(mainWindow);
      await enforceMacOSAppLocation();
    })
}

app.setAppUserModelId('com.electron.google-chat');

app.on('window-all-closed', () => {
  app.exit();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
