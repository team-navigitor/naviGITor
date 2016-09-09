const gitParser = {};
const execFileSync = require ('child_process').execFileSync;
// helper function to parse git data into an object from string
gitParser.parseGit = (commitStr, path) => {
  
  commitStr.replace(/(\r\n|\n|\r)/gm,"");
  var commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.diff = ''
  commitObj.author = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.event = commitStr.match(eventTest)[0].substring(6);
  //
  if(commitObj.event.trim() === 'merge' || /^checkout/.test(commitObj.event)){
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  } else {
    let execCmd = 'git diff ' + commitObj.SHA + '^!'
    execFileSync(execCmd, path, (err, stdout, stderr) => {
    commitObj.diff = stdout;
  })
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
  return commitObj;
};

module.exports = gitParser;
