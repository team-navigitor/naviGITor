// Put xterm and ipcRenderer into global to work around electron issues
// Currently unable to use 'import'
const ipcRenderer = require ('electron').ipcRenderer;
const Terminal = require('xterm');