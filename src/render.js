//logging to dev console
console.log(`render...`)

const { ipcRenderer } = require(`electron`)
const countdown = require("./countdown")

document.getElementById(`exit`).addEventListener(`click`, _ => {
    console.log(`ipcRenderer sending countdown-start"`)
    ipcRenderer.send(`countdown-start`)
})

ipcRenderer.on(`countdown`, (evt,count) => {
    console.log(`ipcRenderer received countdown:${count}`)
    document.getElementById(`exit`).innerText = `exit in ${count}`
})