const fs = require('fs');
const path = require('path');
const gitParser = {};
var Rx = require('rxjs/Rx');

var fileStream = Rx.Observable.bindNodeCallback(fs.readFile);
// parses the most recent git event and passes value to callback function
gitParser.mostRecentEvent = (gitPath) => {
  let result = fileStream(gitPath +'/.git/logs/HEAD', 'utf8');
    result.map(x => x.split('\n'))
      .flatMap(x => x)
      .filter(x => x.length > 40)
      .last()
      .subscribe(x => parseGit((x), e => console.error(e), () => console.log('completed FullgitLog')))
  },

// parses the entire .git log file and returns an array of commit objects
gitParser.allEvents = (gitPath) => {
  let result = fileStream(gitPath +'/.git/logs/HEAD', 'utf8');
    result.map(x => x.split('\n'))
      .flatMap(x => x)
      .filter(x => x.length > 40)
      .subscribe(x => parseGit((x), e => console.error(e), () => console.log('completed FullgitLog')))
};

// helper function to parse git data into an object from string
function parseGit(commitStr) {
  var commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.author = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.event = commitStr.match(eventTest)[0].substring(6);
  if(commitObj.event.substring(0, 6).trim() === 'merge'){
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  }
  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.event) + 1 + commitObj.event.length)).trim();

  var i = 81;
  while(commitStr.charAt(i) !== '>') {
    commitObj.author += commitStr.charAt(i);
    i++;
  }
  commitObj.author += '>';
  i++;

  while(commitStr.charAt(i) !== '-') {
    commitObj.time += commitStr.charAt(i);
    i++;
  }
  commitObj.time.trim();
console.log(commitObj);
};

module.exports = gitParser;
