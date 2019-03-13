const msg = {
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

function initSuccess() {
    return {
        type: msg.IPC_TARGET_INIT_SUCCESS
    };
}

function connectSuccess() {
    return {
        type: msg.IPC_TARGET_CONNECT_SUCCESS
    };
}

function calibratingSuccess(index) {
    return {
        type: msg.IPC_TARGET_CALIBRATING_SUCCESS,
        data: { index }
    };
}

module.exports = {
    msg: msg,
    initSuccess: initSuccess,
    connectSuccess: connectSuccess,
    calibratingSuccess: calibratingSuccess,
};