// Our custom build process
const fs = require('fs')
const { spawn } = require('child_process')

function log(...args) {
    console.log(...args)
}

// Electron watch process
let elect = spawn('electron', ['dist'], { cwd: __dirname, shell: true })
elect.stdout.on('data', data => {
    log('electron: ', data.toString())
})
elect.stderr.on('data', data => {
    console.error(data.toString())
})
elect.on('error', code => {
    console.error(code)
    process.exit(1)
})

// Typescript watch process
let tsc = spawn('yarn', ['tsc', '-w'], { cwd: __dirname, shell: true })
tsc.stdout.on('data', data => {
    log('tsc: ', data.toString())
})
tsc.stderr.on('data', data => {
    console.error(data.toString())
})
tsc.on('error', code => {
    console.error(code)
    process.exit(1)
})

// Copy static files from 'src -> dist' process
let timeout
fs.watch(__dirname + '/src').on('change', (ev, fname) => {
    if (fname.endsWith('.tsx') || fname.endsWith('.ts')) return;
    function copyCallback(err) {
        if (err) return console.error(err)
        log('fs:', 'File copy success, /src/' + fname + ' -> /dist/' + fname)
    }
    // Throttle saving with 100 millis
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        fs.copyFile(__dirname + '/src/' + fname, __dirname + '/dist/' + fname, copyCallback)
    }, 100)
})