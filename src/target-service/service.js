import Logger from '@/common/Logger';
import {store} from '@/common/store';
import * as actions from './actions';
import * as ipcActions from './ipc-actions';
import IPC from './ipc-actions.json';
import {fork} from 'child_process';

const logger = Logger.child({service: 'Target-Service'});

let enabled = false;
let targets = [];

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};

export function initTargets() {
  const targetService = fork('bridge/target-service.js');

  //kill old process before init
  if (targets.length > 0) {
    targets.forEach(target => target.process.kill('SIGINT'));
    targets = [];
  }

  targetService.on('message', arduinoDevices => {
    if (!arduinoDevices) {
      logger.error('NO Arduino Controller Device was found. Arduino-related features will behave as no-op.');
    } else {
      enabled = true;
      logger.info(`Found ${arduinoDevices.length} Arduino devices`);
    }

    // Create processes dedicated to the Arduino handle
    targets = arduinoDevices.map(arduinoDevice => {
      return {
        process: fork('bridge/target-handler.js'),
        arduinoDevice: arduinoDevice
      }
    });

    // Listen for target messages
    targets.forEach((target, index) =>
      target.process.on('message', ({type, data}) => {
        if (type) {
          switch(type) {
            case IPC.INIT_SUCCESS:
              store.dispatch(actions.initialized(data.deviceConfig, index));
              break;
            case IPC.CONNECT_SUCCESS:
              store.dispatch(actions.connected(index));
              break;
            case IPC.CALIBRATING_SUCCESS:
              store.dispatch(actions.calibrated(index));
              break;
          }
        }
      })
    );

    // Init targets
    targets.forEach(target => target.process.send(ipcActions.init(target.arduinoDevice, enabled)));

    // Kill the service
    targetService.kill('SIGINT');
  });

  targetService.send(ipcActions.findAll(arduinoSignature));
}

export function connectTargets() {
  targets.forEach(target => target.process.send(ipcActions.connect()))
}

export function startPairingTarget(device) {
  targets[device.index].process.send(ipcActions.startPairing());
}

export function stopPairingTarget(device, position) {
  targets[device.index].process.send(ipcActions.stopPairing());
  store.dispatch(actions.paired(device.index, position));
}

export function startCalibratingTargets() {
  targets.forEach(target => target.process.send(ipcActions.calibrating()));
}

export function gameReset() {
  targets.forEach(target => target.process.send(ipcActions.gameReset()));
}