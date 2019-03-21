const logger = require('../common/Logger.js').child({service: 'Target-Service'});
const BRIDGE_IN = require('../common/bridge-actions.json').IN;
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');

/**
 * Find ports by a signature
 * @param manufacturer Array
 * @param vendorId Array
 * @param productId Array
 * @returns {Promise<*>}
 */
const find = async ({manufacturer = [], vendorId = [], productId = []}) => {
  const ports = await SerialPort.list();
  if (!ports || ports.length === 0) {
    throw new Error('No ports currently connected');
  }
  return ports.filter(port => manufacturer.includes(port.manufacturer)
    && vendorId.includes(port.vendorId)
    && productId.includes(port.productId));
};

/**
 * bridge messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case BRIDGE_IN.FIND_ALL:
      logger.debug("Find port called");
      process.send(await find(data));
      break;
  }
});
