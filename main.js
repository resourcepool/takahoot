'use strict';

// Require electron
const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

// Module to check for platform
const platform = require('os').platform();

// Modules to create app tray icon and context menu
const Menu = electron.Menu;
const Tray = electron.Tray;

// Create variables for icons to prevent disappearing icon when the JavaScript object is garbage collected.
let trayIcon = null;
let appIcon = null;

// Determine appropriate icon for platform
// if (platform == 'darwin') {
//   trayIcon = path.join(__dirname, 'src', 'assets/grease-the-groove-icon.png')
// } else if (platform == 'win32') {
//   trayIcon = path.join(__dirname, 'src', 'assets/grease-the-groove-icon.ico')
// }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;

if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createWindow() {
  // Create the browser window.
  // with specific icon and don't show it until it is ready (show: false)
  mainWindow = new BrowserWindow({
    // icon: trayIcon,
    height: 600,
    show: false,
    title: 'Takahoot',
    width: 800,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  });

  // Create tray icon
  // appIcon = new Tray(trayIcon)

  // Create RightClick context menu for tray icon
  // with two items - 'Restore app' and 'Quit app'
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore app',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Quit app',
      click: () => {
        mainWindow.close()
      }
    }
  ]);

  // Set title for tray icon
  // appIcon.setTitle('Grease the Groove')

  // Set toot tip for tray icon
  // appIcon.setToolTip('Grease the Groove')

  // Create RightClick context menu
  // appIcon.setContextMenu(contextMenu)

  // Restore (open) the app after clicking on tray icon
  // if window is already open, minimize it to system tray
  // appIcon.on('click', () => {
  //   mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  // })

  // and load the index.html of the app.
  let indexPath;

  // Setup for Webpack
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (dev) {
      mainWindow.webContents.openDevTools()
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });

  // Minimize window to system tray
  mainWindow.on('minimize',function(event){
    event.preventDefault()
    mainWindow.hide()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
});