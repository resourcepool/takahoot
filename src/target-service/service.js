import Logger from '@/common/Logger';
import {store} from '@/common/store';
const logger = Logger.child({service: 'Target-Service'});
import {TARGET_FIND_ALL, TARGET_INIT, TARGET_CONNECT, TARGET_START_PAIRING, TARGET_STOP_PAIRING, TARGET_START_CALIBRATING, TARGET_END_CALIBRATING} from './actions.json';
import {initSuccess, connectSuccess, stopPairing, endCalibrating, calibratingSuccess} from './actions';
import {fork} from 'child_process';

let enabled = false;

let handlers = [];

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};


export function initTargets() {
  const targetsHandler = fork('bridge/targets-handler.js');

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
      target.send({
        type: TARGET_INIT,
        data: {
          deviceConfig: arduinoDevice,
          enabled: enabled
        }
      });
      handlers.push(target);
      arduinoDevice.targetIndex = handlers.length - 1;
    });

    targetsHandler.kill('SIGINT');
    store.dispatch(initSuccess(arduinoDevices));
  });

  targetsHandler.send({
    type: TARGET_FIND_ALL,
    data: arduinoSignature
  });
}

export function connectTargets() {
  store.getState().devices.forEach(device => {
    handlers[device.data.targetIndex].send({
      type: TARGET_CONNECT
    });
  });
  store.dispatch(connectSuccess());
}

export function startPairingTarget(device) {
  handlers[device.data.targetIndex].send({
    type: TARGET_START_PAIRING
  });
}

export function stopPairingTarget(device, index) {
  handlers[device.data.targetIndex].send({
    type: TARGET_STOP_PAIRING
  });
  store.dispatch(stopPairing(index));
}


export function startCalibratingTargets() {

  function calibratingPromise(device) {
    return new Promise(resolve => {
      handlers[device.data.targetIndex].on('message', ({type}) => {
        if (type === TARGET_END_CALIBRATING) {
          store.dispatch(endCalibrating(device.data.targetIndex));
          resolve();
        }
      });
      handlers[device.data.targetIndex].send({
        type: TARGET_START_CALIBRATING
      });
    });
  }

  const promises = store.getState().devices.map(device => calibratingPromise(device));

  Promise.all(promises).then(function() {
    store.dispatch(calibratingSuccess());
  });
}