export const msg = {
    "TARGET_INITIALIZED": "TARGET_INITIALIZED",
    "TARGET_CONNECTED": "TARGET_CONNECTED",
    "TARGET_PAIRED": "TARGET_PAIRED",
    "TARGET_CALIBRATED": "TARGET_CALIBRATED",
    "TARGET_GAME_RESET": "TARGET_GAME_RESET"
};

export function initialized(deviceConfig, index) {
    return {
        type: msg.TARGET_INITIALIZED,
        data: { deviceConfig, index }
    };
}

export function connected(index) {
    return {
        type: msg.TARGET_CONNECTED,
        data: { index }
    };
}

export function paired(index, targetPosition) {
    return {
        type: msg.TARGET_PAIRED,
        data: { index, targetPosition }
    };
}

export function calibrated(index) {
    return {
        type: msg.TARGET_CALIBRATED,
        data: { index }
    };
}