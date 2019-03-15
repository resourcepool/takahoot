const logger = require('../common/Logger.js').child({service: 'Target-Handler'});
const conf = require('../common/conf.json');

const ARDUINO_IN = require('./arduino-actions.js').IN;
const ARDUINO_OUT = require('./arduino-actions.js').OUT;

const bridgeOut = require('./bridge-actions.js');
const BRIDGE_IN = require('../common/bridge-actions.json').IN;

const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const Delimiter = require('@serialport/parser-delimiter');

const BAUDRATE = 115200; //same on arduino

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
  const parser = port.pipe(new Delimiter({ delimiter: ARDUINO_IN.END_MESSAGE }));
  port.on('open', () => {
    parser.on('data', (data) => {
      const message = receiveMessage(data);
      if (message) {
        switch (message) {
          case ARDUINO_IN.INITIALIZED:
            logger.debug('Initialized');
            process.send(bridgeOut.initSuccess({deviceConfig}));
            break;
          case ARDUINO_IN.CONNECTED:
            logger.debug('Connected');
            process.send(bridgeOut.connectSuccess());
            break;
          case ARDUINO_IN.CALIBRATION_FINISHED:
            logger.debug('Calibrated');
            process.send(bridgeOut.calibratingSuccess());
            break;
          case ARDUINO_IN.HIT:
            logger.debug("Button hit");
            process.send(bridgeOut.buttonHit());
            break;
        }
      }
    });
  });
};

const receiveMessage = data => {
  let found = null;
  Object.keys(ARDUINO_IN).forEach(key => {
    if (data.includes(ARDUINO_IN[key])) {
      found = ARDUINO_IN[key];
    }
  });
  console.log(data, found);
  return found;
};

const sendMessage = action => {
  setTimeout(() => {
    port.write(action);
  }, conf.BRIDGE_DELAY);
};

/**
 * bridge messages go here
 */
process.on('message', ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case BRIDGE_IN.INIT:
      logger.debug('Open Serial Connection');
      init(data);
      break;
    case BRIDGE_IN.CONNECT:
      logger.debug('Connect to device');
      sendMessage(ARDUINO_OUT.CONNECTING);
      break;
    case BRIDGE_IN.START_PAIRING:
      logger.debug('Start pairing');
      sendMessage(ARDUINO_OUT.START_PAIRING);
      break;
    case BRIDGE_IN.STOP_PAIRING:
      logger.debug('Stop pairing');
      sendMessage(ARDUINO_OUT.FINISH_PAIRING);
      break;
    case BRIDGE_IN.CALIBRATING:
      logger.debug('Start calibration');
      sendMessage(ARDUINO_OUT.START_CALIBRATION);
      break;
    case BRIDGE_IN.GAME_RESET:
      logger.debug('Reset the game');
      sendMessage(ARDUINO_OUT.GAME_RESET);
      break;
  }
});
