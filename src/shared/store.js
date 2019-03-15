import {createStore, applyMiddleware, combineReducers} from 'redux';
import targetReducer from '@/target-service/reducer';
import kahootReducer from '@/kahoot-service/reducer';
import { default as middlewares }  from '@/target-service/middleware';

function createAppStore() {
  return createStore(combineReducers({targetReducer, kahootReducer}), {}, applyMiddleware(...middlewares));
}

export const store = createAppStore();
