# AwaitLock
Mutex locks for ES7 async functions and delegating generator functions

[![npm package](https://nodei.co/npm/await-lock.png?downloads=true&downl\
oadRank=true&stars=true)](https://nodei.co/npm/await-lock/)

# Usage

```javascript
var lock = new AwaitLock();

async function runSerialTaskAsync() {
  await lock.acquireAsync();
  try {
    // Run async code in the critical section
  } finally {
    lock.release();
  }
}
```

You can also use AwaitLock with [co](https://github.com/tj/co) and generator functions.

```javascript
var runSerialTaskAsync = co.wrap(function*() {
  yield lock.acquireAsync();
  try {
    // IMPORTANT: Do not return a promise from here because the finally clause
    // may run before the promise settles, and the catch clause will not run if
    // the promise is rejected
  } finally {
    lock.release();
  }
});
```
