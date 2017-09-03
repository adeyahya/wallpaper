// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const settings = require('electron-settings');
let appIcon = null
const ipc = require('electron').ipcRenderer
let trayOn = false

const Unsplash = require('./src/unsplash');
const unsplash = new Unsplash(require('./config').app_id);
unsplash.getRandom();

document.getElementById('interval-value').value = settings.get('global.interval')

document.getElementById('interval').addEventListener('submit', function(e) {
  e.preventDefault();
  settings.set('global', {
    interval: document.getElementById('interval-value').value
  })
  ipc.send('setting-saved')
})
