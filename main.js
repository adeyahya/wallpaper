const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const ipc = electron.ipcMain
const dialog = electron.dialog
const Menu = electron.Menu
const Tray = electron.Tray
const nativeImage = electron.nativeImage

const settings = require('electron-settings');
let appIcon = null

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.dock.hide();

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 450,
    height: 750,
    resizable: false,
    fullscreenable: false,
    title: "Wallpaper",
    icon:'./IconTemplate.png'
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('minimize',function(event){
    event.preventDefault()
    mainWindow.hide()
  });

  mainWindow.on('close', function(event) {
    if( !app.isQuiting){
      event.preventDefault()
      mainWindow.hide()
    }
    return false;
  })
}

function createTray() {
  const iconPath = path.join(__dirname, 'IconTemplate.png')
  appIcon = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: function () {
        mainWindow.show();
      }
    }, {
      label: 'Quit',
      click: function() {
        app.isQuiting = true
        app.quit();
      }
    }
  ])
  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  createWindow()
  createTray()
  // mainWindow.hide()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
    createTray()
  }
})

ipc.on('setting-saved', function (event) {
  dialog.showErrorBox('Information', 'Setting Saved!')
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
