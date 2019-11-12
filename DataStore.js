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

}

module.exports = DataStore
