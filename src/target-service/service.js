import Logger from '@/common/Logger';
import {store} from '@/common/store';
const logger = Logger.child({service: 'Target-Service'});
import * as actions from './actions';
import * as ipcActions from './ipc-actions'
import {fork} from 'child_process';

let enabled = false;

let handlers = [];

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};


export function initTargets() {
  const targetsHandler = fork('bridge/target-service.js');

  //kill old process before init
  if (handlers.length > 0) {
    handlers.forEach(handler => {
      handler.kill('SIGINT');
    });
    handlers = [];
  }

  targetsHandler.on('message', arduinoDevices => {
    if (!arduinoDevices) {
      logger.error('NO Arduino Controller Device was found. Arduino-related features will behave as no-op.');
    } else {
      enabled = true;
      logger.info(`Found ${arduinoDevices.length} Arduino devices`);
    }

    // Create a process dedicated to the Arduino handle
    arduinoDevices.forEach(arduinoDevice => {
      const target = fork('bridge/target-handler.js');
      target.send(ipcActions.init(arduinoDevice, enabled));
      handlers.push(target);
      arduinoDevice.targetIndex = handlers.length - 1;
    });

    targetsHandler.kill('SIGINT');
    store.dispatch(actions.initSuccess(arduinoDevices));
  });

  targetsHandler.send(ipcActions.findAll(arduinoSignature));
}

export function connectTargets() {
  function connectPromise(device) {
    return new Promise(resolve => {
      handlers[device.data.targetIndex].on('message', ({type}) => {
        if (type === ipcActions.msg.IPC_TARGET_CONNECT_SUCCESS) {
          resolve();
        }
      });
      handlers[device.data.targetIndex].send(ipcActions.connect());
    });
  }

  const promises = store.getState().devices.map(device => connectPromise(device));

  Promise.all(promises).then(function() {
    store.dispatch(actions.connectSuccess());
  });
}

export function startPairingTarget(device) {
  handlers[device.data.targetIndex].send(ipcActions.startPairing());
}

export function stopPairingTarget(device, index) {
  handlers[device.data.targetIndex].send(ipcActions.stopPairing());
  store.dispatch(actions.paired(index));
}


export function startCalibratingTargets() {

  function calibratingPromise(device) {
    return new Promise(resolve => {
      handlers[device.data.targetIndex].on('message', ({type}) => {
        if (type === ipcActions.msg.IPC_TARGET_CALIBRATING_SUCCESS) {
          store.dispatch(actions.calibrated(device.data.targetIndex));
          resolve();
        }
      });
      handlers[device.data.targetIndex].send(ipcActions.calibrating());
    });
  }

  const promises = store.getState().devices.map(device => calibratingPromise(device));

  Promise.all(promises).then(function() {
    store.dispatch(actions.calibratingSuccess());
  });
}

export function gameReset() {
  console.log('target calibrated !', store.getState().devices)
  store.getState().devices.forEach(
    device => handlers[device.data.targetIndex].send(ipcActions.gameReset())
  );
}