import {app, BrowserWindow} from 'electron';
import store from '../config.js';

const isMacOS = process.platform === 'darwin';
let isQuitting = false;

export default (window: BrowserWindow) => {
  // Handle quit from dock menu (macOS)
  app.on('before-quit', () => {
    isQuitting = true;
  });

  window.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      window.hide();

      // On macOS, minimize on close
      if (isMacOS) {
        app.dock.hide();
      }
    }
  });

  // Restore dock icon when window is shown (macOS)
  window.on('show', () => {
    if (isMacOS) {
      app.dock.show();
    }
  });
}
