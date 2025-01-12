import path from 'path';
import {app, BrowserWindow, nativeImage} from 'electron';
import store from './config';

export default (url: string): BrowserWindow => {
  const window = new BrowserWindow({
    webPreferences: {
      autoplayPolicy: 'user-gesture-required',
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      disableBlinkFeatures: 'Auxclick',
      preload: path.join(app.getAppPath(), 'lib/preload/index.js'),
      spellcheck: !store.get('app.disableSpellChecker'),
      webSecurity: true,
    },
    icon: nativeImage.createFromPath(path.join(app.getAppPath(), 'resources/icons/normal/256.png')),
    show: false,
    minHeight: 570,
    minWidth: 480,
    center: true,
    title: 'Google Chat',
    backgroundColor: '#E8EAED',
    autoHideMenuBar: store.get('app.hideMenuBar'),
  });

  window.once('ready-to-show', () => {
    if (!store.get('app.startHidden')) {
      window.show();
    }
  });

  window.loadURL(url, {
    userAgent: app.userAgentFallback
  });

  return window;
};
