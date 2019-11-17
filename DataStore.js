/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2019-11-11T20:09:29-05:00
 * @Filename: DataStore.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2019-11-17T01:39:14-05:00
 */

const Store = require('electron-store');

class DataStore extends Store {

  constructor(settings) {
    super(settings)
  }

  setData(key, value) {
    this.set(key, value);
    return this
  }

  getData(key) {
    return this.get(key);
  }

  dataExists(key) {
    return this.has(key);
  }

  deleteData(key) {
    return this.delete(key);
  }

  clearData() {
    return this.clear();
  }

}

module.exports = DataStore
