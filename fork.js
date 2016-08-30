process.on('message', m => {
var out = process.stdout.on(m);
    console.log('out: ', out)
    console.log(process.stdin.write('$' + m + '\n'))
})