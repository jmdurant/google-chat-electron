import {app, BrowserWindow, Menu, nativeImage, Tray} from 'electron';
import path from 'path';

const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

export default (window: BrowserWindow): Tray => {
  const iconSize = isMacOS ? 16 : 32;
  const iconPath = path.join(app.getAppPath(), `resources/icons/normal/${iconSize}.png`);
  const tray = new Tray(nativeImage.createFromPath(iconPath));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Window',
      click: () => {
        window.show();
      }
    },
    {
      label: 'Hide Window',
      click: () => {
        window.hide();
      }
    },
    {type: 'separator'},
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip(app.name);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      window.show();
    }
  });

  return tray;
}
