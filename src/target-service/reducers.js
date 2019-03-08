import Device from '@/common/entities/Device';
import {TARGET_CONNECT_SUCCESS, TARGET_INIT_SUCCESS} from './actions.json';

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
            state.devices = action.data.devices.map(data => new Device(data, Device.states.INITIALIZED));
            state.lastAction = TARGET_INIT_SUCCESS;
            return state;
        case TARGET_CONNECT_SUCCESS:
            state.devices.forEach(device => device.state = Device.states.CONNECTED);
            state.lastAction = TARGET_CONNECT_SUCCESS;
            return state;
    }
}