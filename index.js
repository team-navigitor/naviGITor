const electron = require('electron');
const child = require('child_process');
const {ipcMain, dialog} = require('electron');
const chokidar = require('chokidar');
const path = require('path');
const gitParser = require('./src/GitParser/gitparser.js');
const exec = child.exec();

//var ls = child.fork('fork.js');
const Shell = require ('shelljs');
const fs = require('fs');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 900,
    minHeight: 600
  })

  // REMOVE /dist WHEN READY TO DEPLOY
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})



/******************************************************************************
        *** File Watching and Emitting Events to Rendering Process ***
        Following methods, when triggered, calls simpleGit to parse log event
        then send that event and data to the render process in app.js
*******************************************************************************/
// to receive the path of file to be watched from renderer process,
ipcMain.on('dirChoice', function(event, input){
    openDirChoice();
});
// sets file watching and triggers event chain when git log is modified
function openDirChoice() {
  let projectPath = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
  // to resolve to home path and append path given from renderer process
  var gitPath = (path.resolve('~', projectPath.toString()));

  // Watches for all local git activity
  chokidar.watch((projectPath + '/.git/logs/HEAD'), {ignoreInitial: true}).on('all', (event, path) =>
        gitParser.mostRecentEvent(gitPath, function(data) { 
          mainWindow.webContents.send('commitMade', data)})
  );

  // Just loads git log history
  gitParser.allEvents(gitPath, function(data) { 
    mainWindow.webContents.send('parsedCommitAll', data);
  });
};
/******************************************************************************
        *** Terminal Emulation ***
*******************************************************************************/

// receive input from terminal
const fork = child.fork(`${__dirname}/fork.js`);
ipcMain.on('term-input', (event, input) => {
  //const fork = child.fork(`${__dirname}/fork.js`);
  console.log('ipcmain firing')
  fork.send(input)
  })

// ipcMain.on('send-dir', dir => {
//   console.log('ipc main send-dir firing')
//   mainWindow.webContents.send('send-dir', dir)
// })

ipcMain.on('get-dir', () => {
  //const fork = child.fork(`${__dirname}/fork.js`);
  console.log('ipc main get-dir firing')
  fork.send('get-dir')
})
fork.on('message', m => {
  if(m.dirOnly) {
    console.log(m.dirOnly)
    mainWindow.webContents.send('send-dir', m)
  }
  else mainWindow.webContents.send('reply', m)
  //mainWindow.webContents.send('reply', m)
})