/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2019-11-11T21:25:15-05:00
 * @Filename: Window.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2019-11-14T22:34:20-05:00
 */



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
