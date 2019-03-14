const logger = require('./Logger.js').child({service: 'Target-Handler'});
const actions = require('./ipc-actions.js');
const IPC = actions.msg;
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const BAUDRATE = 115200; //same on arduino

const OUT = {
  CONNECTING: Buffer.from([0x30]), // <=> 0011 0000
  START_PAIRING: Buffer.from([0x31]), // <=> 0011 0001
  FINISH_PAIRING: Buffer.from([0x32]), // <=> 0011 0002
  START_CALIBRATION: Buffer.from([0x33]), // <=> 0011 0003
  GAME_RESET: Buffer.from([0x34]) // <=> 0011 0004
};

const IN = {
  CONNECTED: Buffer.from([0xC0]), // <=> 1100 0000
  CALIBRATION_STARTED: Buffer.from([0xC1]), // <=> 1100 0001
  CALIBRATION_FINISHED: Buffer.from([0xC2]), // <=> 1100 0002
  HIT: Buffer.from([0xC3]), // <=> 1100 0003
  TOLERANCE_CHANGED: Buffer.from([0xC4]), // <=> 1100 0004
  END_MESSAGE: Buffer.from([0x0D, 0x0A])
};

let buffer = new Buffer([]);
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

  /**
   * TARGET messages go here
   */
  port.on('error', error => logger.warn(error));
  port.on('readable', () => {
    const message = receiveMessage(port.read());
    if (message) {
      switch (message) {
        case IN.CONNECTED:
          logger.debug("Connected");
          process.send(actions.connectSuccess());
          break;
        case IN.CALIBRATION_FINISHED:
          logger.debug("Calibrated");
          process.send(actions.calibratingSuccess());
          break;
      }
    }
  });
};

const receiveMessage = data => {
  console.log(data);
  buffer = Buffer.concat([data]);
  if (buffer.includes(IN.END_MESSAGE)) {
    let found = null;
    Object.keys(IN).forEach(key => {
      if (buffer.includes(IN[key])) {
        buffer = new Buffer([]);
        found = IN[key];
      }
    });
    if (found === null) {
      logger.warn('receive END_MESSAGE but no message found');
    }
    buffer = new Buffer([]);
    return found;
  }
};

/**
 * IPC messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case IPC.INIT:
      logger.debug("Open Serial Connection");
      await init(data);
      logger.debug("Serial Connection opened");
      process.send(actions.initSuccess(data));
      break;
    case IPC.CONNECT:
      logger.debug("Connect to device");
      await port.write(OUT.CONNECTING);
      process.send(actions.connectSuccess()); //HACK, we receive a connection from arduino normally
      break;
    case IPC.START_PAIRING:
      logger.debug("Start pairing");
      port.write(OUT.START_PAIRING);
      break;
    case IPC.STOP_PAIRING:
      logger.debug("Stop pairing");
      port.write(OUT.FINISH_PAIRING);
      break;
    case IPC.CALIBRATING:
      logger.debug("Start calibration");
      port.write(OUT.START_CALIBRATION);
      break;
    case IPC.GAME_RESET:
      logger.debug("Reset the game");
      port.write(OUT.GAME_RESET);
      break;
  }
});
