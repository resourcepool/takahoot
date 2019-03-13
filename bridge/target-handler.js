const logger = require('./Logger.js').child({service: 'Target-Handler'});
const actions = require('./ipc-actions.js');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const BAUDRATE = 115200; //same on arduino
const OUT_CONNECTED = 0x30; // <=> 0011 0000
const OUT_START_PAIRING = 0x31; // <=> 0011 0001
const OUT_FINISH_PAIRING = 0x32; // <=> 0011 0002
const OUT_START_CALIBRATION = 0x33; // <=> 0011 0003
const OUT_GAME_RESET = 0x34; // <=> 0011 0004

const IN_CONNECTED = 0xC0; // <=> 1100 0000
const IN_CALIBRATION_STARTED = 0xC1; // <=> 1100 0001
const IN_CALIBRATION_FINISHED = 0xC2; // <=> 1100 0002
const IN_HIT = 0xC3; // <=> 1100 0003
const IN_TOLERANCE_CHANGED = 0xC4; // <=> 1100 0004
const IN_END_MESSAGE = [0x0D, 0x0A];

const resolveIfEnd = (data, message, resolve) => {
  logger.debug(message, data);
  if (data.length >= 3
    && IN_END_MESSAGE[1] === data[data.length - 1]
    && IN_END_MESSAGE[0] === data[data.length - 2]
    && message === data[data.length - 3]) {
    resolve();
  }
};

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

const connected = () => {
  return new Promise(resolve => {
    port.on('data', data => resolveIfEnd(data, IN_CONNECTED, resolve));
    port.write(Buffer.from([OUT_CONNECTED]));
    resolve(); // HACK : no response from the arduino for the moment
  })
};

const startPairing = async () => {
  await port.write(Buffer.from([OUT_START_PAIRING]));
};

const stopPairing = async () => {
  await port.write(Buffer.from([OUT_FINISH_PAIRING]));
};

const startCalibration = () => {
  return new Promise(resolve => {
    port.on('data', data => resolveIfEnd(data, IN_CALIBRATION_FINISHED, resolve));
    port.write(Buffer.from([OUT_START_CALIBRATION]));
  })
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
    case actions.msg.IPC_TARGET_INIT:
      logger.debug("Open Serial Connection");
      await init(data);
      logger.debug("Serial Connection opened");
      process.send(actions.initSuccess());
      break;
    case actions.msg.IPC_TARGET_CONNECT:
      logger.debug("Connect to device");
      await connected();
      logger.debug("Connected");
      process.send(actions.connectSuccess());
      break;
    case actions.msg.IPC_TARGET_START_PAIRING:
      logger.debug("Start pairing");
      await startPairing();
      break;
    case actions.msg.IPC_TARGET_STOP_PAIRING:
      logger.debug("Stop pairing");
      await stopPairing();
      break;
    case actions.msg.IPC_TARGET_CALIBRATING:
      logger.debug("Start calibration");
      await startCalibration();
      logger.debug("Calibrated");
      process.send(actions.calibratingSuccess());
      break;
    case actions.msg.IPC_TARGET_GAME_RESET:
      logger.debug("Reset the game");
      await gameReset();
      break;
  }
});
