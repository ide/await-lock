const co = require('co');

import AwaitLock from '../AwaitLock';

it('can be acquired asynchronously and released', async () => {
  const lock = new AwaitLock();
  await lock.acquireAsync();
  lock.release();
});

it('can be acquired with yield running in co', co.wrap(function*() {
  const lock = new AwaitLock();
  yield lock.acquireAsync();
  lock.release();
}));

it('throws if released while unacquired', () => {
  const lock = new AwaitLock();
  expect(() => {
    lock.release();
  }).toThrow();
});

it('blocks async code that has not acquired the lock', async () => {
  const lock = new AwaitLock();

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
