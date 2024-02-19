// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electron',
  {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    runBashScript: (scriptPath) => ipcRenderer.invoke('runBashScript', scriptPath),
    writeFile: (path, data, options) => ipcRenderer.invoke('writeFile', path, data, options)
  }
);