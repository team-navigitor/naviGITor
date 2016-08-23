var Application = require('spectron').Application
var assert = require('assert')
const path = require('path')
const fs = require('fs')
var appPath = path.resolve(__dirname, '../'); //require the whole thing
var electronPath = path.resolve(__dirname, '../node_modules/.bin/electron');
var mainProcess = require('electron-prebuilt').process;
//var mainProcess = electron.remote.process

if (mainProcess) console.log('main process')
//var mainProcess = require('electron-prebuilt').remote.process;


// describe('application launch', function () {
//   this.timeout(5000)

//   beforeEach(function() {
//     this.app = new Application({
//       path: electronPath,
//      // args: [appPath], // pass args along with path
//     });
//     return this.app.start();
//   });

//   afterEach(function () {
//     if (this.app && this.app.isRunning()) {
//       return this.app.stop()
//     }
//   })

//   it('shows an initial window', function () {
//     console.log(this.app.client)
//     return this.app.client.getWindowCount().then(function (count) {
//       assert.equal(count, 1)
//     })
    
//   })

// })

describe('ipcMain', function () {
    this.timeout(5000)

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
  it('calls exec when it receives msg from terminal', function () {
    //console.log(this.app.client)
      return this.app.client.waitUntilWindowLoaded()
      .then(function() { return this.electron.ipcRenderer.send('term-input', 'ls')
      }).then(function () {console.log (this.electron.remote.ipcMain.on === ('term-input', function(event, input) {
  //call child-process exec, using input
  Shell.exec(input, function (error, stdout, stderr) {
    if(stderr) console.log('error!!! ' + error)
    //send response from child-process back to renderer
    let str;
    stderr ? str = stderr : str = stdout
    event.sender.send('reply', str)
  })
}))

        
      
        //return this.ipcMain.on('term-input', function(){console.log('yes')})
        //console.log("yes" + this.app.client)
        //return this.app.client.ipcMain.on('term-input', 'git branch -v')
     
      })
  })
})

