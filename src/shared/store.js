import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';
import { default as middlewares }  from '@/target-service/middleware';

const initialState = {
  lastAction: '',
  lastActionDeviceIndex: -1,
  devices: [],
  gamePin: ''
};


function createAppStore() {
  return createStore(reducer, initialState, applyMiddleware(...middlewares));
}

export const store = createAppStore();
