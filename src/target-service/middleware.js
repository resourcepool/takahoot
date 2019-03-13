/**
 * Remote control middleware
 * @param {Object} store - The store
 * @return {Function} The middleware
 */
const TargetMiddleware = store => next => action => {
  switch (action.type) {
    default: break;
  }
  next(action);
};

export default [
  TargetMiddleware
]