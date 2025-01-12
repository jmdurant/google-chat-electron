import unhandled from 'electron-unhandled';
import log from 'electron-log';
import {app} from 'electron';

export default () => {
  unhandled({
    logger: (error: Error) => {
      log.error(error);
    },
    reportButton: (error: Error) => {
      const debugInfo = `
Version: ${app.getVersion()}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
OS: ${process.platform} ${process.arch} ${process.getSystemVersion()}
`;

      const body = `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo}`;
      
      // Open GitHub issue in browser
      require('electron').shell.openExternal(
        `https://github.com/ankurk91/google-chat-electron/issues/new?body=${encodeURIComponent(body)}`
      );
    }
  });
};
