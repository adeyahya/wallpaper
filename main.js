const path = require('path')
const url = require('url')
const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  Tray,
  nativeImage
} = require('electron')

const settings = require('electron-settings');
let appIcon = null

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null
let force_quit = false

app.dock.hide();

function createWindow () {
  // Create the browser window.
  let self = this
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    // resizable: false,
    fullscreenable: false,
    title: "WallSplash!",
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
    if (app.quitting) {
      app.quit()
    } else {
      event.preventDefault()
      mainWindow.hide()
    }

    app.quitting = true
  })

  mainWindow.on('show', () => {
    app.quitting = false
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
        app.quitting = true
        app.quit()
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
})

app.on('before-quit', () => {
  app.quitting = true
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
  } else {
    mainWindow.show();
  }

  app.quitting = false
})

ipcMain.on('setting-saved', function (event) {
  dialog.showErrorBox('Information', 'Setting Saved!')
})
