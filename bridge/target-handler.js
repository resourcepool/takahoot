const logger = require('./Logger.js').child({service: 'Target-Handler'});
const Actions = require('./actions.js');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const Readline = require('@serialport/parser-readline');
const {promisify} = require('util');

let port;

const openConnection = async ({deviceConfig, enabled}) => {
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

const connectToDevice = async () => {
  port.on('data', function (data) {
    logger.debug('Is still connected?', port.isOpen());
    logger.debug('Data: ' + data);
    port.close();
  });
  await port.write(Buffer.from([0x30]));
  setTimeout(function(){ port.write(Buffer.from([0x31]));
    logger.debug('...0x31 sended !')}, 3000);

};

// const map = async () => {
//   await port.write(Buffer.from([0x31]));
// };

/**
 * IPC messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {

    case Actions.OPEN_CONNECTION:
      logger.debug("Open Serial Connection");
      await openConnection(data);
      break;
    case Actions.CONNECT_TO_DEVICE:
      logger.debug("Connect to device");
      await connectToDevice();
    // case Actions.MAPPING_DEVICE:
    //   logger.debug("Mapping device");
    //   await map();
  }
});
