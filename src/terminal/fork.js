
const fork = require('child_process').fork;
//const exec = require('child_process').exec;
const terminal = require('terminal.js');
let currDir;
const Term = new terminal()


Term.write(`PROMPT_COMMAND='PS1=$(pwd)" $ "'\r`);
Term.write('clear \r');

process.on('message', data => { 
  console.log('data rec', data);
  console.log('string' + Term.write('ls')); 
});

Term.on('data', data => {
  // Find path
  process.send({
    data,
  });

  const re = /\s[$]\s/g;
  if (data.match(re)) {
    let temp = data;
    temp = temp.replace(re, '');
    currDir = temp;
    process.send({ currDir });
    }
});

// process.on('message', (m) => {
//     if(m === 'get-dir') {
//         console.log('getting dir')
//         let pwd = getDir()
//         let user = '';
//         exec('id -u -n', (err, stdout, stderr) => {
//             const assignUser = input => {
//                 console.log(input);
//                 user = input;
//             };
//             assignUser(stdout)
//         })
//         let hostname = ''
//         // let hostname = exec('hostname -fs', (err, stdout, stderr) => {
//         //     return stdout;
//         // })
//         process.send({
//             dirOnly: pwd,
//             user: user,
//             hostname: hostname})
//     }
//     //if (err) console.error(err)
//     else{
//         console.log('fork msg rec')
//     let res = '';
//     let pwd = '';
//     const arr = m.split(' ');
//     var command = arr.shift();
//     if (command === 'git') {
//         exec(m, (error, stdout, stderr) => {
//             console.log('err: ', stderr)
//             error ? res = stderr : res = stdout;
//             pwd = getDir();
//             process.send({
//                 res: res,
//                 pwd: pwd
//             })
//             //console.log('reply: ' + reply.res + ' ' + getDir())
//         })
//     }
//     else{
//         if(shell[command]) res = shell[command](...arr).stdout;
//         else res = 'invalid entry';
//         pwd = getDir();
//         process.send({
//             res: res,
//             pwd: pwd
//         })
//     }
//     }
//     //var out = process.stdout.on(m);
//     //console.log('out: ', out)
//     //console.log(process.stdin.write('$' + m + '\n'))
//     //process.send('hi')
// })

// // process.on('gett-dir', () => {
// //     console.log('fork send-dir firing')
// //     process.send('send-dir', 'hi')
// // })

// getDir = () => {
//     fullDir = shell.pwd().stdout.split('/');
//     return fullDir[fullDir.length - 1]}