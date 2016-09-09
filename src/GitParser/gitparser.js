const gitParser = {};
const execSync = require('child_process').execSync;


// helper function to parse git data into an object from string
gitParser.parseGit = (commitStr, path) => {

  commitStr.replace(/(\r\n|\n|\r)/gm,"");
  var commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.diff = '';
  commitObj.author = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.eventType = commitStr.match(eventTest)[0].substring(6);
  //
  if(commitObj.eventType.trim() === 'merge' || /^checkout/.test(commitObj.eventType)){
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  } else {
    let execCmd = 'git diff ' + commitObj.SHA + '^!';
    
    console.log('path: ' + path + ' sha: ' + commitObj.SHA + 'cmd: ' + execCmd)
    
    commitObj.diff = execSync(execCmd, {cwd: path})
    
    
    
      //console.log('diff in exec: ' + commitObj.diff)
    }
    if (commitObj.SHA) console.log('commit diff: ' + commitObj.diff)
    else console.log('not a commit, diff: ' + commitObj.diff)
  

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
