const electron = require('electron')
const readGit = require('./src/localGitAccess/localGitREAD');
const child = require('child_process');
const {ipcMain} = require('electron');
const chokidar = require('chokidar');
const path = require('path');
const simpleGit = require('simple-git')();
const exec = child.exec;
const Shell = require ('shelljs');
const {dialog} = require('electron');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let projectPath

function opendDirChoice() {
  console.log(projectPath);
  projectPath = dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
  console.log('project path: ' + projectPath);
}

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

// File watching process for local git COMMITS
chokidar.watch(path.join(__dirname, './.git/logs/HEAD'), {ignoreInitial: true}).on('all', (event, path) => {
  simpleGit.log(function(err, log) {
    if(err){
      console.log('error on commit event: ' + err);
    } else {
      mainWindow.webContents.send('commitMade', log.latest);
    }
   });
});

// File watching process for local git BRANCH CHECKOUTS
chokidar.watch(path.join(__dirname, './.git/HEAD'), {ignoreInitial: true}).on('all', (event, path) => {
  simpleGit.status(function(err, status) {
    if(err){console.log('error on branch event: ' + err)
    } else {
    mainWindow.webContents.send('changedBranches', status.current);
    }
   });
});

/******************************************************************************
        *** Terminal Emulation ***
*******************************************************************************/

// receive input from terminal
ipcMain.on('term-input', function(event, input) {
  //call child-process exec, using input
  Shell.exec(input, function (error, stdout, stderr) {
    if(stderr) console.log('error!!! ' + error)
    //send response from child-process back to renderer
    let str;
    stderr ? str = stderr : str = stdout
    event.sender.send('reply', str)
  })
})


ipcMain.on('dirChoice', function(event, input){
    opendDirChoice();
    console.log('dir choice hit');
})
