const IPC = require('./ipc-actions.json');

function initSuccess(data) {
    return {
        type: IPC.INIT_SUCCESS, data
    };
}

function connectSuccess() {
    return {
        type: IPC.CONNECT_SUCCESS
    };
}

function calibratingSuccess() {
    return {
        type: IPC.CALIBRATING_SUCCESS,
    };
}

module.exports = {
    initSuccess: initSuccess,
    connectSuccess: connectSuccess,
    calibratingSuccess: calibratingSuccess,
};