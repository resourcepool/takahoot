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

export function stopPairing(index) {
    return {
        type: Actions.TARGET_STOP_PAIRING,
        data: { index }
    };
}

export function pairingSuccess() {
    return {
        type: Actions.TARGET_PAIRING_SUCCESS
    };
}

export function endCalibrating(index) {
    return {
        type: Actions.TARGET_END_CALIBRATING,
        data: { index }
    };
}

export function calibratingSuccess() {
    return {
        type: Actions.TARGET_CALIBRATING_SUCCESS
    };
}