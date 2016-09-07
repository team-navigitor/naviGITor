const child = require('child_process')
const gitFork = child.fork('./git-fork.js');
const GitParser = require('../GitParser/gitparser.js');
const $ = require('jquery');
const rd3 = require('react-d3-library')
let Commits = {}

gitDiff.pastDays = (days) => {
    const time = Date.now() - (days * 86400000);
    let users = {};
    await $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/days',
        data: time,
    }).then((data => {
        data.forEach(el => {
            console.log(el)
            if (users[el.name]) users[el.name] ++;
            else users[el.name] = 0;
        })
    }))
    return users;
}

gitFork.send('git diff 786c4002028ecda77283b62e677428021af0791f^!')
gitFork.on('message', function(m) {
    var diffArr = m.split('\n')
    console.log(diffArr.length)
    let plusCtr = 0
    let minusCtr = 0
    diffArr.forEach(el => {
        if (el[0] === '+') plusCtr++;
        else if(el[0] === '-') minusCtr++
    })
    console.log('plus ctr: ' + plusCtr + 'min ctr: ' + minusCtr)
})

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
return commitObj;
};