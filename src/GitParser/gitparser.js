const fs = require('fs');
const path = require('path');

const parse = {};

parse.singleEvent = (callback) => {
    let res = '';
    fs.readFile(path.join(__dirname, '../../.git/logs/HEAD'), 'utf8', (err, data) => {
      if (err) return callback(err);  
      //console.log('fs running')
      let i = data.length - 2;
      while (data[i] !== "\n") {
      //console.log(i)
        let temp = data[i] += res;
        res = temp;
        i--;
    } 
       callback(res)
  })

}
parse.singleEvent(function(data) {console.log(data)})

parse.allEvents = (callback) => { 
  const res = [];
  fs.readFile(path.join(__dirname, '../../.git/logs/HEAD'), 'utf8', (err, data) => {
    let dataArr = data.split('\n');
    for (let i = 0; i < dataArr.length - 2; i++) {
      res.push(parseGit(dataArr[i]));
    }
    callback(res)
  })
}

parse.allEvents(function(data) {console.log(data)})
//console.log(fs.readFile(path.join(__dirname, '../../.git/logs/HEAD'), 'utf8', parseGit));

function parseGit(commitStr){
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

module.exports = parse;