const logger = require('./Logger.js').child({service: 'Serial-Port-Utils'});
const Actions = require('./actions.json');
const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const list = promisify(SerialPort.list);

/**
 * Find ports by a signature
 * @param manufacturer Array
 * @param vendorId Array
 * @param productId Array
 * @returns {Promise<*>}
 */
const find = async ({manufacturer = [], vendorId = [], productId = []}) => {
  const ports = await list();
  if (!ports || ports.length === 0) {
    throw new Error('No ports currently connected');
  }
  return ports.filter(port => manufacturer.includes(port.manufacturer)
    && vendorId.includes(port.vendorId)
    && productId.includes(port.productId));
};

const open = async serialInterface => {
  await promisify(serialInterface.open).bind(serialInterface)();
};

/**
 * IPC messages go here
 */
process.on('message', async ({type, data}) => {
  if (!type) {
    return;
  }
  switch (type) {
    case Actions.PORT_LIST:
      logger.debug("List ports called");
      process.send(await list());
      break;
    case Actions.PORT_FIND:
      logger.debug("Find port called");
      process.send(await find(data));
      break;
    case Actions.PORT_OPEN:
      logger.debug("Open port called");
      process.send(await open(data));
      break;
  }
});
