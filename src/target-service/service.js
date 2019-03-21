import Logger from '@/common/Logger';
import {store} from '@/shared/store';
import * as actions from './actions';
import * as bridgeActions from './bridge-actions';
import {OUT as BRIDGE_OUT} from '@/common/bridge-actions.json';
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
            case BRIDGE_OUT.INIT_SUCCESS:
              store.dispatch(actions.initialized(data.deviceConfig, index));
              break;
            case BRIDGE_OUT.CONNECT_SUCCESS:
              store.dispatch(actions.connected(index));
              break;
            case BRIDGE_OUT.CALIBRATING_SUCCESS:
              store.dispatch(actions.calibrated(index));
              break;
            case BRIDGE_OUT.BUTTON_HIT:
              store.dispatch(actions.buttonHit(data.btnId, index));
              break;
          }
        }
      })
    );

    // Init targets
    targets.forEach(target => target.process.send(bridgeActions.init(target.arduinoDevice, enabled)));

    // Kill the service
    targetService.kill('SIGINT');
  });

  targetService.send(bridgeActions.findAll(arduinoSignature));
}

export function connectTargets() {
  targets.forEach(target => target.process.send(bridgeActions.connect()))
}

export function startPairingTarget(device) {
  targets[device.index].process.send(bridgeActions.startPairing());
}

export function stopPairingTarget(device, position) {
  targets[device.index].process.send(bridgeActions.stopPairing());
  store.dispatch(actions.paired(device.index, position));
}

export function startCalibratingTargets() {
  targets.forEach(target => target.process.send(bridgeActions.calibrating()));
}

export function gameReset(index = -1) {
  if (index === -1) {
    targets.forEach(target => target.process.send(bridgeActions.gameReset()));
  } else {
    targets[index].process.send(bridgeActions.gameReset());
  }
}

export function finishTest() {
  store.dispatch(actions.tested());
}
