import { contextBridge, ipcRenderer } from 'electron';

// Setup IPC bridge for secure communication
contextBridge.exposeInMainWorld('electronAPI', {
  // Favicon
  sendFaviconChanged: (href: string) => ipcRenderer.send('faviconChanged', href),
  
  // Offline status
  onOfflineStatusChanged: (callback: (status: boolean) => void) => {
    ipcRenderer.on('offline-status', (_event, status) => callback(status));
  },
  
  // Search
  onSearchShortcut: (callback: () => void) => {
    ipcRenderer.on('search-shortcut', () => callback());
  },
  
  // Notifications
  sendNotification: (title: string, options: NotificationOptions) => 
    ipcRenderer.send('notification', { title, options }),
  onNotificationClicked: (callback: () => void) => 
    ipcRenderer.on('notification-clicked', () => callback()),
  onNotificationClosed: (callback: () => void) => 
    ipcRenderer.on('notification-closed', () => callback()),
  
  // Unread count
  sendUnreadCount: (count: number) => ipcRenderer.send('unread-count-changed', count),
});

// Import feature modules
import './features/faviconObserver';
import './features/offlineHandler';
import './features/searchHandler';
import './features/notificationHandler';
import './features/unreadCounter';
