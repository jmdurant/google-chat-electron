import log from "electron-log";
import {app} from 'electron';
import Store from 'electron-store';

const firstLaunchStore = new Store({
  name: 'first-launch',
  defaults: {
    hasLaunched: false
  }
});

export default () => {
  if (!firstLaunchStore.get('hasLaunched')) {
    log.debug("First launch");
    firstLaunchStore.set('hasLaunched', true);
  }
}
