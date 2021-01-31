import { app, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    })
    win.loadFile('index.html')

    fs.watch(__dirname, (ev, fname) => {
        console.log('Code changed:', { ev, fname })
        win.webContents.reloadIgnoringCache()
    })
    recursiveWathAnySub(__dirname, win)
}

function recursiveWathAnySub(dirname: string, win: BrowserWindow) {
    const contents = fs.readdirSync(dirname)
    for (let entry of contents) {
        const fname = path.join(dirname, entry)
        const item = fs.statSync(fname)
        if (item.isDirectory()) {
            let timeout
            fs.watch(fname, (ev, fname) => {
                timeout = setTimeout(() => {
                    console.log(`Code changed in ${entry}`)
                    win.webContents.reloadIgnoringCache()
                }, 100)
            })
            recursiveWathAnySub(fname, win)
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