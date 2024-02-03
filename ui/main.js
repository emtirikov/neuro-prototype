const { app, BrowserWindow} = require('electron')
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
      nodeIntegration: true,
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)
