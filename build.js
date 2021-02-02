// Our custom build process
const fs = require('fs')
const path = require('path')
const { spawn, execSync } = require('child_process')

if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'))
    fs.copyFileSync(
        path.join(__dirname, 'src', 'index.html'),
        path.join(__dirname, 'dist', 'index.html'))
}
if (!fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    fs.copyFileSync(
        path.join(__dirname, 'src', 'index.html'),
        path.join(__dirname, 'dist', 'index.html'))
}

function log(...args) {
    console.log(...args)
}

// Electron watch process
let elect
setTimeout(() => {
    elect = spawnElectron()
}, 2500)
function spawnElectron() {
    let proc = spawn('electron', ['dist'], { cwd: __dirname, shell: true })
    proc.stdout.on('data', data => {
        log('electron: ', data.toString())
    })
    proc.stderr.on('data', data => {
        console.error(data.toString())
    })
    proc.on('error', code => {
        console.error(code)
        process.exit(1)
    })
    return proc
}
// Typescript watch process
let tsc = spawnTsc()
function spawnTsc() {
    let proc = spawn('yarn', ['tsc', '-w'], { cwd: __dirname, shell: true })
    proc.stdout.on('data', data => {
        log('tsc: ', data.toString())
    })
    proc.stderr.on('data', data => {
        console.error(data.toString())
    })
    proc.on('error', code => {
        console.error(code)
        process.exit(1)
    })

    return proc
}

// Copy static files from 'src -> dist' process
let timeout
fs.watch(path.join(__dirname, 'src')).on('change', (ev, fname) => {
    if (fname.endsWith('.tsx') || fname.endsWith('.ts')) return;
    let thing = fs.statSync(path.join(__dirname, 'src', fname))
    if (thing.isDirectory()) return;

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