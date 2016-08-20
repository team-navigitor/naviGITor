//put xterm and ipcRenderer into global to work around electron issues

const ipcRenderer = require ('electron').ipcRenderer;
const Terminal = require('xterm');