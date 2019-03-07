const logger = require('./Logger.js').child({service: 'Target-Handler'});
const Actions = require('./actions.json');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const baudRate = 115200; //same on arduino
let port;

// port.on('data', function (data) {
//   logger.debug('Data port: ' + data);
//   // port.close();
// });
// port.on('readable', function () {
//   const readed = port.read();
//   if (readed) {
//     logger.debug('byte ascii ' + readed.toString('ascii'));
//     logger.debug('byte utf8 ' + readed.toString('utf8'));
//     logger.debug('byte utf16le ' + readed.toString('utf16le'));
//     logger.debug('byte ucs2 ' + readed.toString('ucs2'));
//     logger.debug('byte base64 ' + readed.toString('base64'));
//     logger.debug('byte binary ' + readed.toString('binary'));
//     logger.debug('byte hex ' + readed.toString('hex'));
//     logger.debug('readed ' + readed);
//   }
// });
// setTimeout(function(){ port.write(Buffer.from([0x33]));
//   logger.debug('...0x31 sended !')}, 3000);

const openConnection = async ({deviceConfig, enabled}) => {
  if (!enabled) {
    logger.warn(`Target Handler disabled`);
    return;
  }
  port = new SerialPort(deviceConfig.comName, {autoOpen: false, baudRate});
  promisify(port.open).bind(port);
  promisify(port.write).bind(port);
  await port.open();
  logger.debug(`Port ${deviceConfig.comName} open`);
};

const connectToDevice = async () => {
  await port.write(Buffer.from([0x30]));
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
