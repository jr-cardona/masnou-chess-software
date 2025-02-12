const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, callback) => ipcRenderer.on(channel, (_, data) => callback(data)),
        removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    }
});
