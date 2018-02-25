import assert from 'assert';

export default class AwaitLock {
  private acquired = false;
  private waitingResolvers: Array<() => void> = [];

  acquire() {
    if (!this.acquired) {
      this.acquired = true;
      return Promise.resolve();
    }

    return new Promise<void>(resolve => this.waitingResolvers.push(resolve));
  }

  release() {
    assert(this.acquired, 'Trying to release an unacquired lock');

    const resolve = this.waitingResolvers.shift();
    if (resolve !== undefined) { // shift() returns undefined if the array is empty
      resolve();
    } else {
      this.acquired = false;
    }
  }
}
