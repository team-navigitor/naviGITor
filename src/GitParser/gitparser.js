const gitParser = {};

// helper function to parse git data into an object from string
gitParser.parseGit = commitStr => {
  commitStr.replace(/(\r\n|\n|\r)/gm,"");
  var commitObj = {};
  commitObj.parent = [commitStr.substring(0, 40)];
  commitObj.SHA = commitStr.substring(41, 81);
  commitObj.user = '';
  commitObj.time = '';
  var eventTest = /(-)\d\d\d\d[^:]*|(\+)\d\d\d\d[^:]*/;
  commitObj.event = commitStr.match(eventTest)[0].substring(6);
  //
  if(commitObj.event.trim() === 'merge' || /^checkout/.test(commitObj.event)){
    commitObj.parent.push(commitObj.SHA);
    commitObj.SHA = null;
  }

  commitObj.message = commitStr.substring((commitStr.indexOf(commitObj.event) + 1 + commitObj.event.length)).trim();

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
