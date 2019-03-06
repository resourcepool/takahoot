const logger = require('../lib/log/Logger').child({service: 'Target-Handler'});
const Actions = require('../actions');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

let port;

const init = async ({deviceConfig, enabled}) => {
  if (!enabled) {
    logger.warn(`Target Handler disabled`);
    return;
  }
  port = new SerialPort(deviceConfig.comName, {autoOpen: false});
  promisify(port.open).bind(port);
  promisify(port.write).bind(port);
  await port.open();
  logger.debug(`Port ${deviceConfig.comName} open`);
};

const connect = async () => {
  await port.write(Buffer.from([0x30]));
};

const map = async () => {
  await port.write(Buffer.from([0x31]));
};

/**
 * IPC messages go here
 */
self.onmessage = async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {

    case Actions.OPEN_CONNECTION:
      logger.debug("Open Serial Connection");
      await init(data);
      break;
    case Actions.CONNECT_TO_DEVICE:
      logger.debug("Connect to device");
      await connect();
    case Actions.MAPPING_DEVICE:
      logger.debug("Mapping device");
      await map();
  }
};
