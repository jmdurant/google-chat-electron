import {app, shell, Menu, BrowserWindow} from 'electron';
import store from '../config.js';

const isMacOS = process.platform === 'darwin';

const getDebugInfo = () => {
  return `
Version: ${app.getVersion()}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
OS: ${process.platform} ${process.arch} ${process.getSystemVersion()}
`;
};

export default (window: BrowserWindow) => {
  const template = [
    ...(isMacOS ? [{
      label: app.name,
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {
          label: 'Preferences',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            window.webContents.send('preferences-shortcut');
          }
        },
        {type: 'separator'},
        {role: 'services'},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideOthers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    }] : []),
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteAndMatchStyle'},
        {role: 'delete'},
        {role: 'selectAll'},
        {type: 'separator'},
        {
          label: 'Search',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            window.webContents.send('search-shortcut');
          }
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forceReload'},
        {role: 'toggleDevTools'},
        {type: 'separator'},
        {role: 'resetZoom'},
        {role: 'zoomIn'},
        {role: 'zoomOut'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      label: 'Window',
      submenu: [
        {role: 'minimize'},
        {role: 'zoom'},
        ...(isMacOS ? [
          {type: 'separator'},
          {role: 'front'},
          {type: 'separator'},
          {role: 'window'}
        ] : [
          {role: 'close'}
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Report an Issue',
          click: () => {
            const body = encodeURIComponent(getDebugInfo());
            shell.openExternal(`https://github.com/ankurk91/google-chat-electron/issues/new?body=${body}`);
          }
        },
        {
          label: 'View on GitHub',
          click: () => {
            shell.openExternal('https://github.com/ankurk91/google-chat-electron');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);

  if (store.get('app.hideMenuBar')) {
    window.setAutoHideMenuBar(true);
    window.setMenuBarVisibility(false);
  }
};
