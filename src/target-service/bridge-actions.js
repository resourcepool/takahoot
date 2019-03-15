import {IN as BRIDGE_IN} from '@/common/bridge-actions.json';

/**
 * Action creator dispatched when a serial connection should be open
 * @return {Object} A poll messages action
 */
export function findAll(arduinoSignature) {
    return {
        type: BRIDGE_IN.FIND_ALL,
        data: arduinoSignature
    };
}

export function init(deviceConfig, enabled) {
    return {
        type: BRIDGE_IN.INIT,
        data: { deviceConfig, enabled }
    };
}

export function connect() {
    return {
        type: BRIDGE_IN.CONNECT
    };
}

export function startPairing() {
    return {
        type: BRIDGE_IN.START_PAIRING
    };
}

export function stopPairing() {
    return {
        type: BRIDGE_IN.STOP_PAIRING
    };
}

export function calibrating() {
    return {
        type: BRIDGE_IN.CALIBRATING
    };
}

export function gameReset() {
    return {
        type: BRIDGE_IN.GAME_RESET
    };
}