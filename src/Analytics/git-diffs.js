const child = require('child_process')
const gitFork = child.fork('./git-fork.js');

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
setTimeout(gitFork.kill, 3000)