import Device from '@/common/entities/Device';
import {OPEN_CONNECTION_SUCCESS} from './actions.json';


const initialState = {
    messages: [],
    devices: []
};

/**
 * @param {Object} state The current application state
 * @param {Object} action The redux action
 * @return {Object} The update state if it changed
 */
export default function target(state = initialState, action) {
    switch (action.type) {
        case OPEN_CONNECTION_SUCCESS: {
            state.devices = action.data.devices.map(data => new Device(data, Device.states.TO_IDENFITY));
            return state;
        }
        default:
            return state;
    }
}