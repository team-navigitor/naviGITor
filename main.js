const electron = require('electron')
const readGit = require('./src/localGitAccess/localGitREAD');
const child = require('child_process');
const {ipcMain} = require('electron');
const chokidar = require('chokidar');
const path = require('path');
const simpleGit = require('simple-git')('./.git/');
const exec = child.exec;

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 1100, height: 700})

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

// File watching process for local git changes
// when triggered, calls simpleGit to parse most recent log event
// then sends that event and data to the render process (app.js)
chokidar.watch(path.join(__dirname, './.git/'), {ignoreInitial: true}).on('all', (event, path) => {
  console.log(event, path);
  simpleGit.log(function(err, log) {
    console.log(log.latest);
    mainWindow.webContents.send('commitMade', log.latest);
   });
  //mainWindow.webContents.send('commitMade', readGit.getLatestLogMessage());
  //function broadcastLastCommit()
});

// receive input from terminal
ipcMain.on('term-input', function(event, input) {
  //call child-process exec, using input
  exec(input, function (error, stdout, stderr) {
    //send response from child-process back to renderer
    event.sender.send('reply', stdout)
  })
})