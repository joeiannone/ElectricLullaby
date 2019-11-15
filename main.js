/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2019-11-09T12:17:15-05:00
 * @Filename: main.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2019-11-14T22:31:47-05:00
 */



const { app, Menu } = require('electron')

const path = require('path')

const Window = require('./Window')

const DataStore = require('./DataStore')

const data = new DataStore();
//console.log(data.getData('test'));

const isMac = process.platform === 'darwin'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow

function main () {
  // Create the browser window.
  mainWindow = new Window({
    file: 'index.html'
  })

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    main()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
