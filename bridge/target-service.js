const logger = require('./Logger.js').child({service: 'Serial-Port-Utils'});
const actions = require('./ipc-actions.js');
const IPC = require('./ipc-actions.json');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

/**
 * Find ports by a signature
 * @param manufacturer Array
 * @param vendorId Array
 * @param productId Array
 * @returns {Promise<*>}
 */
const find = async ({manufacturer = [], vendorId = [], productId = []}) => {
  const ports = await promisify(SerialPort.list)();
  if (!ports || ports.length === 0) {
    throw new Error('No ports currently connected');
  }
  return ports.filter(port => manufacturer.includes(port.manufacturer)
    && vendorId.includes(port.vendorId)
    && productId.includes(port.productId));
};

/**
 * IPC messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case IPC.FIND_ALL:
      logger.debug("Find port called");
      process.send(await find(data));
      break;
  }
});
