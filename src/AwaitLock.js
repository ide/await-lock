import assert from 'assert';

export default class AwaitLock {

  constructor() {
    this._acquired = false;
    this._waitingResolvers = [];
  }

  acquireAsync() {
    if (!this._acquired) {
      this._acquired = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this._waitingResolvers.push(resolve);
    });
  }

  release() {
    assert(this._acquired, 'Trying to release an unacquired lock');
    if (this._waitingResolvers.length > 0) {
      let resolve = this._waitingResolvers.shift();
      resolve();
    } else {
      this._acquired = false;
    }
  }
}
