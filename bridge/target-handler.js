const logger = require('./Logger.js').child({service: 'Target-Handler'});
const Actions = require('./actions.json');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const BAUDRATE = 115200; //same on arduino
const OUT_CONNECTED = 0x30; // <=> 0011 0000
const OUT_START_PAIRING = 0x31; // <=> 0011 0001
const OUT_FINISH_PAIRING = 0x32; // <=> 0011 0002
const OUT_START_CALIBRATION = 0x33; // <=> 0011 0003
const OUT_GAME_RESET = 0x34; // <=> 0011 0004
let port;

const init = async ({deviceConfig, enabled}) => {
  if (!enabled) {
    logger.warn(`Target Handler disabled`);
    return;
  }
  port = new SerialPort(deviceConfig.comName, {autoOpen: false, baudRate: BAUDRATE});
  promisify(port.open).bind(port);
  promisify(port.write).bind(port);
  await port.open();
  logger.debug(`Port ${deviceConfig.comName} open`);
};

const connected = async () => {
  await port.write(Buffer.from([OUT_CONNECTED]));
};

const startPairing = async () => {
  await port.write(Buffer.from([OUT_START_PAIRING]));
};

const finishPairing = async () => {
  await port.write(Buffer.from([OUT_FINISH_PAIRING]));
};

const startCalibration = async () => {
  await port.write(Buffer.from([OUT_START_CALIBRATION]));
};

const gameReset = async () => {
  await port.write(Buffer.from([OUT_GAME_RESET]));
};

/**
 * IPC messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case Actions.TARGET_INIT:
      logger.debug("Open Serial Connection");
      await init(data);
      break;
    case Actions.TARGET_CONNECT:
      logger.debug("Connect to device");
      await connected();
      break;
    case Actions.TARGET_START_PAIRING:
      logger.debug("Start pairing");
      await startPairing();
      break;
    case Actions.TARGET_FINISH_PAIRING:
      logger.debug("Finish pairing");
      await finishPairing();
      break;
    case Actions.TARGET_CALIBRATION:
      logger.debug("Start calibration");
      await startCalibration();
      break;
    case Actions.TARGET_GAME_RESET:
      logger.debug("Reset the game");
      await gameReset();
      break;
  }
});
