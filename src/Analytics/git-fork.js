const exec = require('child_process').exec;
const spawn = require('child_process').spawn;

process.on('message', (m) => {
    console.log(m)
    exec(m, function(err, stdout, stderr) {
        console.log('p', stdout.length)
        process.send(stdout)
    })
})