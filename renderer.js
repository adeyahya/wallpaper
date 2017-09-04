// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const settings = require('electron-settings')
const ipc = require('electron').ipcRenderer
let appIcon = null

const Unsplash = require('./src/unsplash');
const unsplash = new Unsplash(require('./config').app_id);
unsplash.getRandom();

document.getElementById('interval-value').value = settings.get('timer.interval')

document.getElementById('interval').addEventListener('submit', function(e) {
  e.preventDefault();
  settings.set('timer', {
    interval: document.getElementById('interval-value').value
  })
  ipc.send('setting-saved')
})
