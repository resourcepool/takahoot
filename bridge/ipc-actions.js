const msg = {
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

function initSuccess(data) {
    return {
        type: msg.INIT_SUCCESS, data
    };
}

function connectSuccess() {
    return {
        type: msg.CONNECT_SUCCESS
    };
}

function calibratingSuccess() {
    return {
        type: msg.CALIBRATING_SUCCESS,
    };
}

module.exports = {
    msg: msg,
    initSuccess: initSuccess,
    connectSuccess: connectSuccess,
    calibratingSuccess: calibratingSuccess,
};