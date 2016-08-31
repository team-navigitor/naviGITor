const shell = require('shelljs');
const fork = require('child_process').fork;


    process.on('data', m => {
    var out = process.stdout.on(m);
    console.log('out: ', out)
    console.log(process.stdin.write('$' + m + '\n'))
}) 