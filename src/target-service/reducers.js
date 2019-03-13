import Device from '@/common/entities/Device';
import * as actions from './actions.js';

const initialState = {
    lastAction: '',
    devices: []
};

/**
 * @param {Object} state The current application state
 * @param {Object} action The redux action
 * @return {Object} The update state if it changed
 */
export default function target(state = initialState, action) {
    switch (action.type) {
        case actions.msg.TARGET_INIT_SUCCESS:
            state.devices = action.data.devices.map((data, index) => new Device(data, Device.states.INITIALIZED, index));
            state.lastAction = actions.msg.TARGET_INIT_SUCCESS;
            return state;
        case actions.msg.TARGET_CONNECT_SUCCESS:
            state.devices.forEach(device => device.state = Device.states.CONNECTED);
            state.lastAction = actions.msg.TARGET_CONNECT_SUCCESS;
            return state;
        case actions.msg.TARGET_PAIRED:
            state.devices[action.data.index].state = Device.states.PAIRED;
            state.lastAction = actions.msg.TARGET_PAIRED;
            return state;
        case actions.msg.TARGET_PAIRING_SUCCESS:
            state.lastAction = actions.msg.TARGET_PAIRING_SUCCESS;
            return state;
        case actions.msg.TARGET_CALIBRATED:
            state.devices[action.data.index].state = Device.states.CALIBRATED;
            state.lastAction = actions.msg.TARGET_CALIBRATED;
            return state;
        case actions.msg.TARGET_CALIBRATING_SUCCESS:
            state.lastAction = actions.msg.TARGET_CALIBRATING_SUCCESS;
            return state;
    }
}