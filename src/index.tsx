import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'


const screenSizes = {
    _1024: { width: 1024, height: 768 },
    _1280: { width: 1280, height: 900 },
}
function createWindow() {
    const win = new BrowserWindow({
        ...screenSizes._1280,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    win.loadFile('index.html')

    let timeout
    fs.watch(__dirname, (ev, fname) => {
        setTimeout(() => {
            console.log('Code changed:', { ev, fname })
            win.webContents.reloadIgnoringCache()
        }, 100)
    })
    recursiveWathAnySub(__dirname, win)
}

let watchedDirs: string[] = []
function recursiveWathAnySub(dirname: string, win: BrowserWindow) {
    const contents = fs.readdirSync(dirname)
    for (let entry of contents) {
        const fpath = path.join(dirname, entry)
        const item = fs.statSync(fpath)
        if (item.isDirectory()) {
            let timeout
            watchedDirs.push(fpath)
            fs.watch(fpath, (ev, fname) => {
                // Check for newly created folders with in folder
                let checkItem = path.join(fpath, fname)
                fs.stat(checkItem, (_err, stats) => {
                    if (stats.isDirectory()) {
                        if (!watchedDirs.includes(checkItem)) {
                            recursiveWathAnySub(checkItem, win)
                        }
                    }
                })
                // Bind code check to this folder
                timeout = setTimeout(() => {
                    console.log(`Code changed in ${entry}:`, { ev, fname })
                    win.webContents.reloadIgnoringCache()
                }, 100)
            })
            recursiveWathAnySub(fpath, win)
        }
    }

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
}) 