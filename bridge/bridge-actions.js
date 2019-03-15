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

module.exports = {
    initSuccess: initSuccess,
    connectSuccess: connectSuccess,
    calibratingSuccess: calibratingSuccess,
};