const gitParser = {};

// helper function to parse git data into an object from string
gitParser.parseGit = commitStr => {
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
  return commitObj;
};

module.exports = gitParser;
