import {BrowserWindow, ipcMain, Notification} from 'electron';

interface NotificationData {
  title: string;
  options: NotificationOptions;
}

export default (window: BrowserWindow) => {
  // Handle notification requests from renderer
  ipcMain.on('notification', (_event, data: NotificationData) => {
    // Create native notification
    const notification = new Notification({
      title: data.title,
      body: data.options.body,
      icon: data.options.icon,
      silent: data.options.silent === true,
      timeoutType: 'default'
    });

    // Handle notification click
    notification.on('click', () => {
      // Focus the window when notification is clicked
      if (window.isMinimized()) {
        window.restore();
      }
      window.show();
      window.focus();

      // Send click event to renderer
      window.webContents.send('notification-clicked');
    });

    // Handle notification close
    notification.on('close', () => {
      window.webContents.send('notification-closed');
    });

    // Show the notification
    notification.show();
  });

  // Handle notification click from renderer
  ipcMain.on('notificationClicked', () => {
    if (window.isMinimized()) {
      window.restore();
    }
    if (!window.isVisible()) {
      window.show();
    }
    window.focus();
  });
};
