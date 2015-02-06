# AwaitLock
Mutex locks for ES7 async functions and delegating generator functions

# Usage

```javascript
var lock = new AwaitLock();

async function runSerialTaskAsync() {
  await lock.acquireAsync();
  try {
    // Run async code in the critical section
  } finally {
    await lock.releaseAsync();
  }
}
```

You can also use AwaitLock with [co](https://github.com/tj/co) and generator functions.

```javascript
var runSerialTaskAsync = co.wrap(function*() {
  yield lock.acquireAsync();
  try {
    // IMPORTANT: Do not return from here since the "finally" clause will not
    // run!
  } finally {
    yield lock.releaseAsync();
  }
});
```
