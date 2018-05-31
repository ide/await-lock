declare module 'await-lock' {
  class AwaitLock {
    constructor();
    acquireAsync(): Promise<void>;
    release(): void;
  }
  export = AwaitLock;
}
