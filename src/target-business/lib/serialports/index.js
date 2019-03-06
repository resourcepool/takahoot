const SerialPort = require('@serialport/stream');
SerialPort.Binding = require('@serialport/bindings');
const {promisify} = require('util');

const list = promisify(SerialPort.list);

const findInterface = async (predicate) => {
    const ports = await list();
    if (!ports || ports.length === 0) {
        throw new Error('No ports currently connected');
    }
    return ports.filter(predicate);
};

const openInterface = async (serialInterface) => {
    await promisify(serialInterface.open).bind(serialInterface)();
};

module.exports = {
    list,
    findInterface,
    openInterface,
};
