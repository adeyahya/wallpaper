// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let appIcon = null
const ipc = require('electron').ipcRenderer
let trayOn = false

const Unsplash = require('./src/unsplash');
const unsplash = new Unsplash(require('./config').app_id);
unsplash.getRandom();

document.getElementById('minimize').addEventListener('click', function() {
  if (trayOn) {
    trayOn = false
    // document.getElementById('tray-countdown').innerHTML = ''
    ipc.send('remove-tray')
  } else {
    trayOn = true
    const message = 'Click demo again to remove.'
    // document.getElementById('tray-countdown').innerHTML = message
    ipc.send('put-in-tray')
  }
})

// Tray removed from context menu on icon
ipc.on('tray-removed', function () {
  ipc.send('remove-tray')
  trayOn = false
  // document.getElementById('tray-countdown').innerHTML = ''
})
