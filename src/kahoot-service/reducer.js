// import Device from '@/shared/entities/device';
// import Player from '@/shared/entities/player';
import * as actions from './actions.js';

const initialState = {
    lastAction: '',
    gamePin: ''
};

/**
 * @param {Object} state The current application state
 * @param {Object} action The redux action
 * @return {Object} The update state if it changed
 */
export default function kahootReducer(state = initialState, action) {
    let index;
    switch (action.type) {
        case actions.msg.KAHOOT_INIT:
            state.gamePin = action.gamePin;
            state.devices.forEach((device, index) => {
                device.player.name = action.devices[index].player.name
            });
            state.lastAction = actions.msg.KAHOOT_INIT;
            return state;
        case actions.msg.KAHOOT_STARTED:
            return state;
        default:
            return state;
    }
}
