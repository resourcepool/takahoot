import * as Actions from './actions.json'

/**
 * Action creator dispatched when a serial connection should be open
 * @return {Object} A poll messages action
 */
export function initSuccess(devices) {
    return {
        type: Actions.TARGET_INIT_SUCCESS,
        data: { devices }
    };
}

export function connectSuccess() {
    return {
        type: Actions.TARGET_CONNECT_SUCCESS
    };
}

export function calibrationSuccess(index) {
    return {
        type: Actions.TARGET_CALIBRATION_SUCCESS,
        data: { index }
    };
}