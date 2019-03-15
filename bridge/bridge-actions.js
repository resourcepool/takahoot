const BRIDGE_OUT = require('../common/bridge-actions.json').OUT;

function initSuccess(data) {
    return {
        type: BRIDGE_OUT.INIT_SUCCESS, data
    };
}

function connectSuccess() {
    return {
        type: BRIDGE_OUT.CONNECT_SUCCESS
    };
}

function calibratingSuccess() {
    return {
        type: BRIDGE_OUT.CALIBRATING_SUCCESS,
    };
}

function buttonHit(data) {
    return {
        type: IPC.BUTTON_HIT, data
    };
}

module.exports = {
    initSuccess,
    connectSuccess,
    calibratingSuccess,
    buttonHit,
};
