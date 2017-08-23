require('dotenv').config()
const electron = require('electron')
const {app, BrowserWindow, ipcMain} = electron

app.on('ready', () => {
  let win = new BrowserWindow({width: 1200, height: 800})
  win.loadURL(`file://${__dirname}/index.html`)
})

// Loading a generic view
ipcMain.on('load-page', (event, arg) => {
  let focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.loadURL(arg.link)
})

// Loading a paritcular list's view
ipcMain.on('load-list', (event, arg) => {
  let focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.loadURL(arg.link)
  focusedWindow.webContents.on('did-finish-load', () => {
    focusedWindow.webContents.send('list-view', arg)
  })
})
