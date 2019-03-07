import * as Actions from './actions.json'

/**
 * Action creator dispatched when a serial connection should be open
 * @return {Object} A poll messages action
 */
export function openSerialConnection() {
    return {
        type: Actions.OPEN_CONNECTION,
        data: {}
    };
}

export function openSerialConnectionSuccess(devices) {
    return {
        type: Actions.OPEN_CONNECTION_SUCCESS,
        data: { devices }
    };
}

/**
 * Action creator dispatched when we should connect to a remote device
 * @return {Object} A poll messages action
 */
export function connectToDevice(device, index) {
    return {
        type: Actions.CONNECT_TO_DEVICE,
        data: { device, index }
    };
}

export function connectToDeviceSuccess(device, index) {
    return {
        type: Actions.CONNECT_TO_DEVICE_SUCCESS,
        data: { device, index }
    };
}