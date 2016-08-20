var Application = require('spectron').Application
var assert = require('assert')
const path = require('path')
const fs = require('fs')
var appPath = path.resolve(__dirname, '../'); //require the whole thing
var electronPath = path.resolve(__dirname, '../node_modules/.bin/electron');


describe('application launch', function () {
  this.timeout(5000)

  beforeEach(function() {
    this.app = new Application({
      path: electronPath,
     // args: [appPath], // pass args along with path
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})

describe('window count', function () {
    this.timeout(5000)

    beforeEach(function() {
        this.app = new Application({
            path: electronPath
        })
        return this.app.start();
    });

    afterEach(function () {
        if (this.app && this.app.isRunning()) {
        return this.app.stop()
    }
  })
  it('has a window count of one', function () {
      
  })
})