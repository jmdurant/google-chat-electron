export {};

declare global {
  interface ElectronAPI {
    sendNotification: (title: string, options: NotificationOptions) => void;
    onNotificationClicked: (callback: () => void) => void;
    onNotificationClosed: (callback: () => void) => void;
  }
}

// Store original Notification
const OriginalNotification = window.Notification;

// Override the Notification constructor
window.Notification = function(title: string, options: NotificationOptions) {
  // Send to main process
  window.electronAPI.sendNotification(title, options);
  
  // Return a mock notification object
  return {
    close: () => {},
    onclick: null,
    onclose: null,
    onerror: null,
    onshow: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  } as unknown as Notification;
} as any;

// Copy static properties
Object.defineProperty(window.Notification, 'permission', {
  value: 'granted',
  writable: false,
  configurable: false,
  enumerable: true
});

window.Notification.requestPermission = () => Promise.resolve('granted');

// Listen for notification events from main process
window.electronAPI.onNotificationClicked(() => {
  document.dispatchEvent(new Event('notification-clicked'));
});

window.electronAPI.onNotificationClosed(() => {
  document.dispatchEvent(new Event('notification-closed'));
}); 