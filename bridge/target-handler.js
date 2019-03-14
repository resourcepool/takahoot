const logger = require('./Logger.js').child({service: 'Target-Handler'});
const actions = require('./ipc-actions.js');
const IPC = require('./ipc-actions.json');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const Delimiter = require('@serialport/parser-delimiter');

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

let port;

const init = ({deviceConfig, enabled}) => {
  if (!enabled) {
    logger.warn(`Target Handler disabled`);
    return;
  }
  port = new SerialPort(deviceConfig.comName, {baudRate: BAUDRATE});
  logger.debug(`Port ${deviceConfig.comName} open`);

  /**
   * TARGET messages go here
   */
  const parser = port.pipe(new Delimiter({ delimiter: IN.END_MESSAGE }));
  port.on('open', () => {
    parser.on('data', (data) => {
      const message = receiveMessage(data);
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
  });
};

const receiveMessage = data => {
  let found = null;
  Object.keys(IN).forEach(key => {
    if (data.includes(IN[key])) {
      found = IN[key];
    }
  });
  console.log(data, found);
  return found;
};

/**
 * IPC messages go here
 */
process.on('message', ({type, data}) => {
  if (!type) {
    return;
  }
  if (port) {
    // console.log(port.is)
  }
  switch (type) {
    case IPC.INIT:
      logger.debug("Open Serial Connection");
      init(data);
      logger.debug("Serial Connection opened");
      process.send(actions.initSuccess(data));
      break;
    case IPC.CONNECT:
      logger.debug("Connect to device");
      port.write(OUT.CONNECTING);
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
