export const msg = {
    "FIND_ALL": "FIND_ALL",
    "INIT": "INIT",
    "INIT_SUCCESS": "INIT_SUCCESS",
    "CONNECT": "CONNECT",
    "CONNECT_SUCCESS": "CONNECT_SUCCESS",
    "START_PAIRING": "START_PAIRING",
    "STOP_PAIRING": "STOP_PAIRING",
    "CALIBRATING": "CALIBRATING",
    "CALIBRATING_SUCCESS": "CALIBRATING_SUCCESS",
    "GAME_RESET": "GAME_RESET"
};

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