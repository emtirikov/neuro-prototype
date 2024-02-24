// main.js
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu');
const { exec } = require('child_process');
const fs = require('fs');


contextMenu({
 showSaveImageAs: true
});

ipcMain.handle('runBashScript', (event, scriptPath) => {
  exec(`bash ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution error: ${error}`);
      return;
    }
    return { stdout, stderr };
  });
});

ipcMain.handle('writeFile', (event, path, data, options) => {
  return fs.promises.writeFile(path, data, options);
});

function createWindow () {
  console.log('Creating new window');
  const win = new BrowserWindow({
    width: 1200,
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

ipcMain.on('open-config-window', (event, config) => {
  const win = new BrowserWindow({
    width: 400,
    height: 200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('config.html');
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('init-config', config);
  });
});

app.whenReady().then(createWindow)