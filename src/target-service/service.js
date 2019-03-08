import Logger from '@/common/Logger';
import {store} from '@/common/store';
const logger = Logger.child({service: 'Target-Service'});
import {TARGET_FIND_ALL, TARGET_INIT, TARGET_CONNECT, TARGET_START_PAIRING, TARGET_FINISH_PAIRING} from './actions.json';
import {initSuccess, connectSuccess} from './actions';
import {fork} from 'child_process';

let enabled = false;

let handlers = [];

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};

export async function initTargets() {
  const targetsHandler = fork('bridge/targets-handler.js');

  const initFinishedPromise = new Promise(resolve => {
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
        // let worker = new TargetWorker();
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
      resolve();
    });
  });

  targetsHandler.send({
    type: TARGET_FIND_ALL,
    data: arduinoSignature
  });

  await initFinishedPromise;
}

export async function connectTargets() {
  store.getState().devices.forEach(device => {
    handlers[device.data.targetIndex].send({
      type: TARGET_CONNECT
    });
  });
  store.dispatch(connectSuccess());
}

export async function pairingStartTarget(device) {
  handlers[device.data.targetIndex].send({
    type: TARGET_START_PAIRING
  });
}

export async function pairingFinishTarget(device) {
  handlers[device.data.targetIndex].send({
    type: TARGET_FINISH_PAIRING
  });
}