/**
 * A mutex lock for coordination across async functions
 */
export default class AwaitLock {
  #acquired: boolean = false;
  #waitingResolvers: (() => void)[] = [];

  /**
   * Whether the lock is currently acquired or not. Accessing this property does not affect the
   * status of the lock.
   */
  get acquired(): boolean {
    return this.#acquired;
  }

  /**
   * Acquires the lock, waiting if necessary for it to become free if it is already locked. The
   * returned promise is fulfilled once the lock is acquired.
   *
   * A timeout (in milliseconds) may be optionally provided. If the lock cannot be acquired before
   * the timeout elapses, the returned promise is rejected with an error. The behavior of invalid
   * timeout values depends on how `setTimeout` handles those values.
   *
   * After acquiring the lock, you **must** call `release` when you are done with it.
   */
  acquireAsync({ timeout }: { timeout?: number } = {}): Promise<void> {
    if (!this.#acquired) {
      this.#acquired = true;
      return Promise.resolve();
    }

    if (timeout == null) {
      return new Promise((resolve) => {
        this.#waitingResolvers.push(resolve);
      });
    }

    let resolver: () => void;
    let timer: ReturnType<typeof setTimeout>;

    return Promise.race<void>([
      new Promise((resolve) => {
        resolver = () => {
          clearTimeout(timer);
          resolve();
        };
        this.#waitingResolvers.push(resolver);
      }),
      new Promise<void>((_, reject) => {
        timer = setTimeout(() => {
          this.#waitingResolvers.splice(this.#waitingResolvers.indexOf(resolver), 1);
          reject(new Error(`Timed out waiting for lock`));
        }, timeout);
      }),
    ]);
  }

  /**
   * Acquires the lock if it is free and otherwise returns immediately without waiting. Returns
   * `true` if the lock was free and is now acquired, and `false` otherwise.
   *
   * This method differs from calling `acquireAsync` with a zero-millisecond timeout in that it runs
   * synchronously without waiting for the JavaScript task queue.
   */
  tryAcquire(): boolean {
    if (!this.#acquired) {
      this.#acquired = true;
      return true;
    }

    return false;
  }

  /**
   * Releases the lock and gives it to the next waiting acquirer, if there is one. Each acquirer
   * must release the lock exactly once.
   */
  release(): void {
    if (!this.#acquired) {
      throw new Error(`Cannot release an unacquired lock`);
    }

    if (this.#waitingResolvers.length > 0) {
      let resolve = this.#waitingResolvers.shift()!;
      resolve();
    } else {
      this.#acquired = false;
    }
  }
}
