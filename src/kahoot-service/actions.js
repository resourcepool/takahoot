export const msg = {
    "KAHOOT_INIT": "KAHOOT_INIT",
    "KAHOOT_STARTED": "KAHOOT_STARTED",
    "KAHOOT_JOINED": "KAHOOT_JOINED",
    "KAHOOT_QUIZ_END": "KAHOOT_QUIZ_END",
    "KAHOOT_CLEAN_SESSIONS": "KAHOOT_CLEAN_SESSIONS",
};


export function init(gamePin, devices) {
    return {
        type: msg.KAHOOT_INIT,
        data: { gamePin, devices }
    };
}


export function started(index) {
    return {
        type: msg.KAHOOT_STARTED,
        data: { index }
    };
}

export function joined(kahootSession, index) {
    return {
        type: msg.KAHOOT_JOINED,
        data: { kahootSession, index }
    };
}

export function quizEnd() {
    return {
        type: msg.KAHOOT_QUIZ_END
    };
}

export function clean() {
    return {
        type: msg.KAHOOT_CLEAN_SESSIONS
    };
}
