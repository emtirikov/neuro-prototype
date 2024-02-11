// main.js
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu');

contextMenu({
 showSaveImageAs: true
});

function createWindow () {
  console.log('Creating new window');
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

function createDownloadWindow () {
  console.log('Creating download window');
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('download.html')
}

ipcMain.on('open-download-window', (event, arg) => {
  createDownloadWindow();
})

app.whenReady().then(createWindow)