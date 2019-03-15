import {createStore, applyMiddleware} from 'redux';
import reducers from '@/target-service/reducers';
import { default as middlewares }  from '@/target-service/middleware';

function createAppStore() {
  return createStore(reducers, {}, applyMiddleware(...middlewares));
}

export const store = createAppStore();