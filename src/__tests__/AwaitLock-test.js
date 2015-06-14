jest.autoMockOff();

require('regenerator/runtime');

let co = require('co');

let AwaitLock = require('../AwaitLock');

describe('AwaitLock', () => {

  pit('can be acquired asynchronously and released', async function() {
    let lock = new AwaitLock();
    await lock.acquireAsync();
    lock.release();
  });

  pit('can be acquired with yield running in co', co.wrap(function*() {
    let lock = new AwaitLock();
    yield lock.acquireAsync();
    lock.release();
  }));

  it('throws if released while unacquired', function() {
    let lock = new AwaitLock();
    expect(() => {
      lock.release();
    }).toThrow();
  });

  pit('blocks async code that has not acquired the lock', async function() {
    let lock = new AwaitLock();

    let semaphore = 1;
    async function testSemaphore() {
      await lock.acquireAsync();
      expect(semaphore).toBe(1);

      semaphore--;
      await Promise.resolve();
      expect(semaphore).toBe(0);

      semaphore++;
      lock.release();
    }

    await Promise.all([
      testSemaphore(),
      testSemaphore(),
    ]);
  });
});
