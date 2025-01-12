import {app, BrowserWindow, nativeImage, Tray} from 'electron';
import path from 'path';

const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

export default (window: BrowserWindow, tray: Tray) => {
  window.on('page-title-updated', (_event, title) => {
    const unreadCount = parseInt(title.match(/\((\d+)\)/)?.[1] || '0');
    app.setBadgeCount(unreadCount);

    if (isMacOS || isLinux) {
      const iconPath = path.join(app.getAppPath(), unreadCount > 0 ?
        'resources/icons/unread/256.png' :
        'resources/icons/normal/256.png'
      );
      tray.setImage(nativeImage.createFromPath(iconPath));
    }
  });
}
