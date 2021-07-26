//logging to host OS console
console.log(`starting...`)

const { app, BrowserWindow, ipcMain } = require(`electron`)
const countdown = require(`./countdown`)

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

ipcMain.on(`countdown-start`, _ => {
    console.log(`ipcMain received countdown-start`)
    countdown(count => {
        console.log(`ipcMain send countdown:${count}`)
        mainWindow.webContents.send(`countdown`,count)
    })
})
