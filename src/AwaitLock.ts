import assert from 'assert';

export default class AwaitLock {
  private _acquired: boolean = false;
  private _waitingResolvers: (() => void)[] = [];

  acquireAsync(): Promise<void> {
    if (!this._acquired) {
      this._acquired = true;
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this._waitingResolvers.push(resolve);
    });
  }

  release(): void {
    assert(this._acquired, 'Trying to release an unacquired lock');
    if (this._waitingResolvers.length > 0) {
      let resolve = this._waitingResolvers.shift()!;
      resolve();
    } else {
      this._acquired = false;
    }
  }
}
