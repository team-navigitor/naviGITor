const fs = require('fs');
const path = require('path');

const gitParser = {};


// parses the most recent git event and passes value to callback function
gitParser.mostRecentEvent = (gitPath, callback) => {
    let res = '';
    fs.readFile(gitPath +'/.git/logs/HEAD', 'utf8', (err, data) => {
      if (err) return callback(err);
      //console.log('fs running')
      let i = data.length - 2;
      while (data[i] !== "\n") {
      //console.log(i)
        let temp = data[i] += res;
        res = temp;
        i--;
    }
       callback(parseGit(res))
  })

}

// parses the entire .git log file and returns an array of commit objects
gitParser.allEvents = (gitPath, callback) => {
  const res = [];
  fs.readFile(gitPath +'/.git/logs/HEAD', 'utf8', (err, data) => {
    if (err) return callback(err);
    let dataArr = data.split('\n');
    for (let i = 0; i < dataArr.length - 1; i++) {
      res.push(parseGit(dataArr[i]));
    }
    callback(res)
  });
}

//used as a helper function to gitParser an individual git event from the .git log
function parseSingleGit(commitStr){
  var commitObj = {};
  commitObj.parent = commitStr.substring(0, 41)
  commitObj.secondSHA = commitStr.substring(41, 81);
  commitObj.author = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.event = commitStr.match(eventTest)[0].substring(6);
  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.event) + commitObj.event.length + 2));

  var i = 81;
  while(commitStr.charAt(i) !== '>'){
    commitObj.author += commitStr.charAt(i);
    i++;
  }
  commitObj.author = commitObj.author.trim();
  commitObj.author += '>';
  i++;

  while(commitStr.charAt(i) !== '-'){
    commitObj.time += commitStr.charAt(i);
    i++;
  }
  commitObj.time = commitObj.time.trim();
return commitObj;
};


function parseGit(commitStr){
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


module.exports = gitParser;
