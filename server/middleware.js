const Actions = require('./actions');
const Logger = require('./lib/log/Logger');
const TargetController = require('./target/target-service');

function executeAsync(func) {
  setImmediate(() => {
    try {
      func();
    } catch (e) {
      Logger.warning(`Error caught : ${e}`);
    }
  });
}

const onConnectToDevice = (store) => async (stats) => {
  executeAsync(() => TargetController.connectToDevice(stats));
};

/**
 * Remote control middleware
 * @param {Object} store - The store
 * @return {Function} The middleware
 */
const TargetServerMiddleware = (store) => (next) => (action) => {
  if (action.type === Actions.CONNECT_TO_DEVICE) {
    const {data} = action;
    onConnectToDevice(store)(data);
  }
  next(action);
};

module.exports = [
  TargetServerMiddleware,
];
