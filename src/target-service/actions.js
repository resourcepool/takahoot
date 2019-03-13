export const msg = {
    "TARGET_INIT_SUCCESS": "TARGET_INIT_SUCCESS",
    "TARGET_CONNECT_SUCCESS": "TARGET_CONNECT_SUCCESS",
    "TARGET_PAIRED": "TARGET_PAIRED",
    "TARGET_PAIRING_SUCCESS": "TARGET_PAIRING_SUCCESS",
    "TARGET_CALIBRATED": "TARGET_CALIBRATED",
    "TARGET_CALIBRATING_SUCCESS": "TARGET_CALIBRATING_SUCCESS",
    "TARGET_GAME_RESET": "TARGET_GAME_RESET"
};

export function initSuccess(devices) {
    return {
        type: msg.TARGET_INIT_SUCCESS,
        data: { devices }
    };
}

export function connectSuccess() {
    return {
        type: msg.TARGET_CONNECT_SUCCESS
    };
}

export function paired(index) {
    return {
        type: msg.TARGET_PAIRED,
        data: { index }
    };
}

export function pairingSuccess() {
    return {
        type: msg.TARGET_PAIRING_SUCCESS
    };
}

export function calibrated(index) {
    return {
        type: msg.TARGET_CALIBRATED,
        data: { index }
    };
}

export function calibratingSuccess() {
    return {
        type: msg.TARGET_CALIBRATING_SUCCESS
    };
}