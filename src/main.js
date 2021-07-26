console.log(`starting...`)

const { app, BrowserWindow } = require('electron')

let mainWindow

app.on(`ready`, _ => {
    console.log(`ready...`)
    mainWindow = new BrowserWindow({
        height: 400,
        width: 600,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation: false
        }
    })

    mainWindow.loadFile(`./src/index.html`)
    //mainWindow.webContents.openDevTools()

    mainWindow.on(`closed`, _ => {
        console.log(`closed...`)
        mainWindow = null
    })
})