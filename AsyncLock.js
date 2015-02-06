var assert = require('assert');

class AwaitLock {

  constructor() {
    this._acquired = false;
    this._waitingResolvers = [];
  }

  acquireAsync() {
    if (this._acquired) {
      this._acquired = true;
      return;
    }

    return new Promise((resolve, reject) => {
      this._waitingResolvers.push(resolve);
    });
  }

  releaseAsync() {
    assert(this._promise, 'Trying to release an unacquired lock');
    if (this._waitingResolvers.length > 0) {
      var resolve = this._waitingResolvers.shift();
      resolve();
    } else {
      this._acquired = false;
    }
  }
}

module.exports = AwaitLock;
