import co from 'co';

import AwaitLock from '../AwaitLock';

it('can be acquired asynchronously and released', async () => {
  let lock = new AwaitLock();
  await lock.acquireAsync();
  lock.release();
});

it(
  'can be acquired with yield running in co',
  co.wrap(function*() {
    let lock = new AwaitLock();
    yield lock.acquireAsync();
    lock.release();
  }),
);

it('throws if released while unacquired', () => {
  let lock = new AwaitLock();
  expect(() => {
    lock.release();
  }).toThrow();
});

it('blocks async code that has not acquired the lock', async () => {
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

  await Promise.all([testSemaphore(), testSemaphore()]);
});

describe('acquired', () => {
  it('is set to whether the lock is acquired or not', async () => {
    let lock = new AwaitLock();
    expect(lock.acquired).toBe(false);

    lock.tryAcquire();
    expect(lock.acquired).toBe(true);

    lock.release();
    expect(lock.acquired).toBe(false);
  });
});

describe('tryAcquire', () => {
  it('acquires the lock immediately without waiting', async () => {
    let lock = new AwaitLock();

    let acquired1 = lock.tryAcquire();
    expect(acquired1).toBe(true);

    let acquired2 = false;
    lock.acquireAsync().then(() => {
      acquired2 = true;
    });

    await Promise.resolve();
    expect(acquired2).toBe(false);
  });

  it('returns false if the lock is not free', async () => {
    let lock = new AwaitLock();

    let acquired1 = lock.tryAcquire();
    expect(acquired1).toBe(true);

    let acquired2 = lock.tryAcquire();
    expect(acquired2).toBe(false);

    lock.release();

    let acquired3 = lock.tryAcquire();
    expect(acquired3).toBe(true);
  });
});
