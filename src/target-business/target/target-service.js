const logger = require('../lib/log/Logger').child({service: 'Target-Service'});
const Actions = require('../actions');
const {fork} = require('child_process');
const path = require('path');

let enabled = false;

let handlers = [];

let arduinoDevices;

const arduinoSignature = {
  manufacturer: ['Arduino (www.arduino.cc)', 'Arduino LLC (www.arduino.cc)'],
  vendorId: ['2341'],
  productId: ['0043']
};

const init = async (conf, store) => {
  const serialPortUtils = fork('bridge/serial-port-utils.js');

  const initFinishedPromise = new Promise(resolve => {
    serialPortUtils.on('message', _arduinoDevices => {
      arduinoDevices = _arduinoDevices;
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
          type: Actions.OPEN_CONNECTION,
          data: {
            deviceConfig: arduinoDevice,
            enabled: enabled
          }
        });
        handlers.push(handler);
      });
      serialPortUtils.kill('SIGINT');
      resolve();
    });
  });

  serialPortUtils.send({
    type: Actions.PORT_FIND,
    data: arduinoSignature
  });

  await initFinishedPromise;
};

const getDevices = () => {
  return arduinoDevices;
};

const connectToDevice = data => {
  handlers[data.index].send({
    type: Actions.CONNECT_TO_DEVICE
  });
};

const mapDevice = data => {
  // handlers[data.index].execute({
  //   type: Actions.MAPPING_DEVICE
  // });
};

module.exports = {
  init,
  getDevices,
  connectToDevice
};
