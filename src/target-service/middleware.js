import {OPEN_CONNECTION, CONNECT_TO_DEVICE} from './actions.json';
import {openConnection, connectToDevice} from './service';

function executeAsync(func) {
  setImmediate(() => {
    try {
      func();
    } catch (e) {
      Logger.warning(`Error caught : ${e}`);
    }
  });
}

const onOpenConnection = (store) => async (stats) => {
  executeAsync(() => openConnection(store));
};

const onConnectToDevice = (store) => async (stats) => {
  executeAsync(() => connectToDevice(stats));
};

/**
 * Remote control middleware
 * @param {Object} store - The store
 * @return {Function} The middleware
 */
const TargetMiddleware = store => next => action => {
  if (action.type === OPEN_CONNECTION) {
    const {data} = action;
    onOpenConnection(store)(data);
  }
  if (action.type === CONNECT_TO_DEVICE) {
    const {data} = action;
    onConnectToDevice(store)(data);
  }
  next(action);
};

export default [
  TargetMiddleware
]