const logger = require('../lib/log/Logger').child({service: 'Target-Service'});
const {fork} = require('child_process');
const Actions = require('../actions');
const SerialPortUtils = require('../lib/serialports');

let enabled = false;

let handlers = [];

let arduinoDevices;


const isValidPort = (port) =>
    port.manufacturer === 'Arduino (www.arduino.cc)'
    && port.vendorId === '2341'
    && port.productId === '0043';

const init = async (conf, store) => {
  arduinoDevices = await SerialPortUtils.findInterface(isValidPort);
  if (!arduinoDevices) {
    logger.error('NO Arduino Controller Device was found. Arduino-related features will behave as no-op.');
  } else {
    enabled = true;
    logger.info(`Found ${arduinoDevices.length} Arduino devices`);
  }
  
  // Create a process dedicated to the Arduino handle
  arduinoDevices.forEach(arduinoDevice => {
    let handler = fork(`${__dirname}/target-handler.js`);
    handler.send({
      type: Actions.OPEN_CONNECTION,
      data: {
        deviceConfig: arduinoDevice,
        enabled: enabled
      }
    });
    handlers.push(handler);
  });
};

const getDevices = () => {
  return arduinoDevices;
};

const connectToDevice = (data) => {
  handlers[data.index].send({
    type: Actions.CONNECT_TO_DEVICE
  });
};

module.exports = {
  init,
  getDevices,
  connectToDevice
};
