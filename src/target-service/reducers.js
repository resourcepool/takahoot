import Device from '@/common/entities/Device';
import {TARGET_CONNECT_SUCCESS, TARGET_INIT_SUCCESS, TARGET_STOP_PAIRING, TARGET_PAIRING_SUCCESS, TARGET_END_CALIBRATING} from './actions.json';

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
        case TARGET_INIT_SUCCESS:
            state.devices = action.data.devices.map((data, index) => new Device(data, Device.states.INITIALIZED, index));
            state.lastAction = TARGET_INIT_SUCCESS;
            return state;
        case TARGET_CONNECT_SUCCESS:
            state.devices.forEach(device => device.state = Device.states.CONNECTED);
            state.lastAction = TARGET_CONNECT_SUCCESS;
            return state;
        case TARGET_STOP_PAIRING:
            state.devices[action.data.index].state = Device.states.PAIRED;
            state.lastAction = TARGET_STOP_PAIRING;
            return state;
        case TARGET_PAIRING_SUCCESS:
            state.lastAction = TARGET_PAIRING_SUCCESS;
            return state;
        case TARGET_END_CALIBRATING:
            state.devices[action.data.index].state = Device.states.CALIBRATED;
            state.lastAction = TARGET_END_CALIBRATING;
            return state;
    }
}