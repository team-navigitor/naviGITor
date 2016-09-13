const gitParser = {};
const execSync = require('child_process').execSync;

// function byteCount(s) {
//   return encodeURI(s).split(/%..|./).length - 1;
// }

// helper function to parse git data into an object from string
gitParser.parseGit = (commitStr, path, url) => {
  commitStr.replace(/(\r\n|\n|\r)/gm,"");
  var commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.diff = '';
  commitObj.user = '';
  commitObj.avatarUrl = 'https://avatars.githubusercontent.com/' + url;
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.eventType = commitStr.match(eventTest)[0].substring(6);
  //
  if(commitObj.eventType.trim() === 'merge' || /^checkout/.test(commitObj.eventType)){
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  } else {
    let execCmd = 'git diff ' + commitObj.SHA + '^!';
    commitObj.diff = execSync(execCmd, {cwd: path}).toString();
    commitObj.diffStats = {
      adds: 0,
      subs: 0
    }
    let statsArr = commitObj.diff.split('\n')
    for (let i = 0; i < statsArr.length; i++) {
      if (statsArr[i][0] === '+') commitObj.diffStats.adds++;
      else if (statsArr[i][0] === '-') commitObj.diffStats.subs++;
    }
  }
    //if (commitObj.SHA) console.log('commit diff: ' + commitObj.diff)
    // else console.log('not a commit, diff: ' + commitObj.diff)
  
  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.eventType) + 1 + commitObj.eventType.length)).trim();

  var i = 81;
  while(commitStr.charAt(i) !== '>') {
    commitObj.user += commitStr.charAt(i);
    i++;
  }
  commitObj.user += '>';
  i++;

  while(commitStr.charAt(i) !== '-') {
    commitObj.time += commitStr.charAt(i);
    i++;
  }
  commitObj.time.trim();
  return commitObj;
};

module.exports = gitParser;
