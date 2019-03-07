import Logger from '@/common/Logger';
const logger = Logger.child({service: 'Target-Service'});
import {OPEN_CONNECTION, PORT_FIND, CONNECT_TO_DEVICE} from './actions.json';
import {openSerialConnectionSuccess} from './actions';
import {fork} from 'child_process';

let enabled = false;

let handlers = [];

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};

export async function openConnection(store) {
  const serialPortUtils = fork('bridge/serial-port-utils.js');

  const initFinishedPromise = new Promise(resolve => {
    serialPortUtils.on('message', arduinoDevices => {
      if (!arduinoDevices) {
        logger.error('NO Arduino Controller Device was found. Arduino-related features will behave as no-op.');
      } else {
        enabled = true;
        logger.info(`Found ${arduinoDevices.length} Arduino devices`);
      }

      // Create a process dedicated to the Arduino handle
      arduinoDevices.forEach(arduinoDevice => {
        const handler = fork('bridge/target-handler.js');
        // let worker = new TargetWorker();
        handler.send({
          type: OPEN_CONNECTION,
          data: {
            deviceConfig: arduinoDevice,
            enabled: enabled
          }
        });
        handlers.push(handler);
      });
      serialPortUtils.kill('SIGINT');
      store.dispatch(openSerialConnectionSuccess(arduinoDevices));
      resolve();
    });
  });

  serialPortUtils.send({
    type: PORT_FIND,
    data: arduinoSignature
  });

  await initFinishedPromise;
}

export async function connectToDevice(data) {
  handlers[data.index].send({
    type: CONNECT_TO_DEVICE
  });
}

export async function getDevices() {
  // return arduinoDevices;
}

const mapDevice = data => {
  // handlers[data.index].execute({
  //   type: Actions.MAPPING_DEVICE
  // });
};
