import msg from './ipc-actions.json';

/**
 * Action creator dispatched when a serial connection should be open
 * @return {Object} A poll messages action
 */
export function findAll(arduinoSignature) {
    return {
        type: msg.FIND_ALL,
        data: arduinoSignature
    };
}

export function init(deviceConfig, enabled) {
    return {
        type: msg.INIT,
        data: { deviceConfig, enabled }
    };
}

export function connect() {
    return {
        type: msg.CONNECT
    };
}

export function startPairing() {
    return {
        type: msg.START_PAIRING
    };
}

export function stopPairing() {
    return {
        type: msg.STOP_PAIRING
    };
}

export function calibrating() {
    return {
        type: msg.CALIBRATING
    };
}

export function gameReset() {
    return {
        type: msg.GAME_RESET
    };
}