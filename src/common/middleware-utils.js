export function executeAsync(func) {
  setImmediate(() => {
    try {
      func();
    } catch (e) {
      Logger.warning(`Error caught : ${e}`);
    }
  });
}