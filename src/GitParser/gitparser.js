const fs = require('fs');
const path = require('path')

console.log(fs.readFile(path.join(__dirname, '../../.git/logs/HEAD'), 'utf8', parseGit));

function parseGit(commitStr){
  var commitObj = {};
  commitObj.parent = commitStr.substring(0, 41)
  commitObj.secondSHA = commitStr.substring(41, 81);
  commitObj.author = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.event = commitStr.match(eventTest)[0].substring(6);
  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.event) + commitObj.event.length));

  var i = 81;
  while(commitStr.charAt(i) !== '>'){
    commitObj.author += commitStr.charAt(i);
    i++;
  }
  commitObj.author += '>';
  i++;

  while(commitStr.charAt(i) !== '-'){
    commitObj.time += commitStr.charAt(i);
    i++;
  }
  commitObj.time.trim();
return commitObj;
};
