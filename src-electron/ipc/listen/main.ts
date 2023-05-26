const { app, ipcMain } = require('electron');
const edge = require('electron-edge-js');
const path = require('path');

const isDev = process.env.DEBUGGING ? true : false;
console.log('load listen');
const appPath = app.getAppPath();
const libraryPath = isDev
  ? path.join(appPath, '../../dll-library/bin/debug/ClassLibrary1.dll')
  : path.join(appPath, '../../dll-library/ClassLibrary1.dll');
console.log('libraryPath: ', libraryPath);
ipcMain.on('test', (event, arg) => {
  console.log('call func test', libraryPath);
  console.log(process.env.DEBUGGING);
  // event.returnValue = 'ok: ' + libraryPath;
  const funcTest = edge.func({
    assemblyFile: libraryPath,
    typeName: 'ClassLibrary1.Class1',
    methodName: 'Test',
  });
  let res = '';
  funcTest(arg, function (error: any, result: string) {
    if (error) throw error;
    res = result;
  });

  event.returnValue = res;
});
