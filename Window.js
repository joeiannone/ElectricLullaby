'use strict'

const { BrowserWindow } = require('electron')

// default window settings
const defaultProps = {
  width: 1207,
  height: 750,
  icon: __dirname + '/icon.png',
  transparent: true,
  webPreferences: {
    nodeIntegration: false,
  },
}


class Window extends BrowserWindow {

  constructor ({ file, ...windowSettings }) {

    // calls new BrowserWindow with these props
    super({ ...defaultProps, ...windowSettings })

    // load the html and open devtools
    this.loadFile(file)

    // gracefully show when ready to prevent flickering
    this.once('ready-to-show', () => {
      this.show()
    })

  }
}

module.exports = Window
