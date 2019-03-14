export const msg = {
    "IPC_TARGET_FIND_ALL": "IPC_TARGET_FIND_ALL",
    "IPC_TARGET_INIT": "IPC_TARGET_INIT",
    "IPC_TARGET_INIT_SUCCESS": "IPC_TARGET_INIT_SUCCESS",
    "IPC_TARGET_CONNECT": "IPC_TARGET_CONNECT",
    "IPC_TARGET_CONNECT_SUCCESS": "IPC_TARGET_CONNECT_SUCCESS",
    "IPC_TARGET_START_PAIRING": "IPC_TARGET_START_PAIRING",
    "IPC_TARGET_STOP_PAIRING": "IPC_TARGET_STOP_PAIRING",
    "IPC_TARGET_CALIBRATING": "IPC_TARGET_CALIBRATING",
    "IPC_TARGET_CALIBRATING_SUCCESS": "IPC_TARGET_CALIBRATING_SUCCESS",
    "IPC_TARGET_GAME_RESET": "IPC_TARGET_GAME_RESET"
};

/**
 * Action creator dispatched when a serial connection should be open
 * @return {Object} A poll messages action
 */
export function findAll(arduinoSignature) {
    return {
        type: msg.IPC_TARGET_FIND_ALL,
        data: arduinoSignature
    };
}

export function init(deviceConfig, enabled) {
    return {
        type: msg.IPC_TARGET_INIT,
        data: { deviceConfig, enabled }
    };
}

export function connect() {
    return {
        type: msg.IPC_TARGET_CONNECT
    };
}

export function startPairing() {
    return {
        type: msg.IPC_TARGET_START_PAIRING
    };
}

export function stopPairing() {
    return {
        type: msg.IPC_TARGET_STOP_PAIRING
    };
}

export function calibrating() {
    return {
        type: msg.IPC_TARGET_CALIBRATING
    };
}

export function gameReset() {
    return {
        type: msg.IPC_TARGET_GAME_RESET
    };
}