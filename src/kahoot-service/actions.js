export const msg = {
    "KAHOOT_INIT": "KAHOOT_INIT",
    "KAHOOT_STARTED": "KAHOOT_STARTED",
};


export function init(gamePin, devices) {
    return {
        type: msg.KAHOOT_STARTED,
        data: { gamePin, devices }
    };
}


export function started(index) {
    return {
        type: msg.KAHOOT_STARTED,
        data: { index }
    };
}
