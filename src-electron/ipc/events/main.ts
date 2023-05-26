const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  test: (title: string) => ipcRenderer.sendSync('test', title),
});

contextBridge.exposeInIsolatedWorld(1004, 'electron', {
  doThing: () => ipcRenderer.send('do-a-thing'),
});
