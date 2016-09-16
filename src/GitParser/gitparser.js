const gitParser = {};
const execSync = require('child_process').execSync;

// helper function to parse git data into an object from string
gitParser.parseGit = (commitStr, path, url) => {
  commitStr.replace(/(\r\n|\n|\r)/gm, '');
  const commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.diff = '';
  commitObj.user = '';
  commitObj.avatarUrl = `https://avatars.githubusercontent.com/${url}`;
  commitObj.time = '';
  const eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.eventType = commitStr.match(eventTest)[0].substring(6);
  if (commitObj.eventType.trim() === 'merge' || /^checkout/.test(commitObj.eventType)) {
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  } else {
    const execCmd = `git diff ${commitObj.SHA}^!`;
    commitObj.diff = execSync(execCmd, { cwd: path }).toString();
    commitObj.diffStats = {
      adds: 0,
      subs: 0,
    };
    const statsArr = commitObj.diff.split('\n');
    for (let i = 0; i < statsArr.length; i += 1) {
      if (statsArr[i][0] === '+') commitObj.diffStats.adds += 1;
      else if (statsArr[i][0] === '-') commitObj.diffStats.subs += 1;
    }
  }
  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.eventType) + 1 + commitObj.eventType.length)).trim();

  let i = 81;
  while (commitStr.charAt(i) !== '>') {
    commitObj.user += commitStr.charAt(i);
    i += 1;
  }
  commitObj.user += '>';
  i += 1;

  while (commitStr.charAt(i) !== '-') {
    commitObj.time += commitStr.charAt(i);
    i += 1;
  }
  commitObj.time.trim();
  return commitObj;
};

module.exports = gitParser;
