var Application = require('spectron').Application
var assert = require('assert')
const path = require('path')
const fs = require('fs')
var appPath = path.resolve(__dirname, '../'); //require the whole thing
var electronPath = path.resolve(__dirname, '../node_modules/.bin/electron');
var mainProcess = require('electron-prebuilt').process;
const Sinon = require ('sinon')

describe('ipcMain', function () {
    this.timeout(10000)

    beforeEach(function() {
        this.app = new Application({
            path: electronPath,
            //args: [appPath],
        })
        return this.app.start();
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
        return this.app.stop()
    }
  })
  it('ipcMain fires function on receipt of term-input', function () {
    var msg = Sinon.spy();
    this.app.electron.remote.ipcMain.on('term-input', msg)
    this.app.client.waitUntilWindowLoaded().then(function() {
         this.app.electron.ipcRenderer.send('term-input', 'hi')
    assert(msg.called)
      })
  })
})

