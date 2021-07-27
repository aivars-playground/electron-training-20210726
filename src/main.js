//logging to host OS console
console.log(`starting...`)

const { app, BrowserWindow, ipcMain, Menu, Tray, clipboard, globalShortcut } = require(`electron`)
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


    const menuTemplate = [{
            label: app.getName(),
            submenu: [
                {
                    label: `about`,
                    role: `about` //does not work in ubuntu?
                },
                {
                    type: `separator`
                },
                {
                    label: `quit`,
                    click: _ => {app.quit()}
                }
            ]
    }]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    const tray = new Tray(`./resources/Icon.png`)
    tray.setContextMenu(
        Menu.buildFromTemplate(
            [{label:`<empty>`, enabled: false}]
        )
    )

    function addToStack(item, stack) {
        return [item].concat(stack.length >= 5 ? stack.slice(0,stack.length -1) : stack )
    }

    function checkClipboardForChange(clipboard, onChange) {
        let previous = clipboard.readText()
        let current

        setInterval(_ => {
            current = clipboard.readText()
            if (current !== previous) {
                previous = current
                onChange(previous)
            }
        }, 1000);
    }

    function formatMaxLength(text) {
        return text && text.length > 10
            ? text.substr(0, 7) + `...`
            : text
    }

    function createMenuTemplateForStack(stack) {
        console.log(`mapping:`,stack)
        const mapped = stack.map(
            (item,i) => {return {
                    label:`Copy: ${formatMaxLength(item)}`,
                    click: _=> clipboard.writeText(item)
                }}
        )
        console.log(`mapped:`,mapped)

        return mapped
    }

    let stack = []
    checkClipboardForChange(clipboard, text => {
        stack = addToStack(text, stack)
        console.log(`stack`,stack)
        tray.setContextMenu(
            Menu.buildFromTemplate(createMenuTemplateForStack(stack))
        )
    })
    

    mainWindow.on(`closed`, _ => {
        console.log(`closed...`)
        mainWindow = null
    })
})

app.on(`will-quit`, _ => {
    //good practice
    console.log(`unregistering shortcuts...`)
    globalShortcut.unregisterAll()
})

ipcMain.on(`countdown-start`, _ => {
    console.log(`ipcMain received countdown-start`)
    countdown(count => {
        console.log(`ipcMain send countdown:${count}`)
        mainWindow.webContents.send(`countdown`,count)
    })
})
