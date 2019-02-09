const {createStore, combineReducers, applyMiddleware} = require('redux');

const createAppStore = () => {
  const reducers = require('../reducers');

  const middlewares = applyMiddleware(
    ...require('../middleware'),
  );
  return createStore(reducers, {}, middlewares);
};

module.exports = {
    createAppStore,
};
