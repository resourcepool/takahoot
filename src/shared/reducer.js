import Device from '@/shared/entities/device';
import Player from '@/shared/entities/player';
import {msg as target} from '@/target-service/actions';
import {msg as kahoot} from '@/kahoot-service/actions';

/**
 * @param {Object} state The current application state
 * @param {Object} action The redux action
 * @return {Object} The update state if it changed
 */
export default function reducer(state, action) {
    let index, targetPosition;
    switch (action.type) {
        case target.TARGET_INITIALIZED:
            index = action.data.index;
            state.devices[index] = new Device({
                config: action.deviceConfig,
                state: Device.states.INITIALIZED,
                index: index
            });
            state.lastAction = target.TARGET_INITIALIZED;
            return state;
        case target.TARGET_CONNECTED:
            index = action.data.index;
            state.devices[index].state = Device.states.CONNECTED;
            state.lastAction = target.TARGET_CONNECTED;
            return state;
        case target.TARGET_PAIRED:
            index = action.data.targetPosition;
            targetPosition = action.data.index;
            state.devices[index].state = Device.states.PAIRED;
            state.devices[index].player = new Player({name: `Player ${targetPosition}`, targetPosition});
            state.lastAction = target.TARGET_PAIRED;
            return state;
        case target.TARGET_CALIBRATED:
            index = action.data.index;
            state.devices[index].state = Device.states.CALIBRATED;
            state.lastAction = target.TARGET_CALIBRATED;
            return state;
        case target.TARGET_HIT:
            index = action.data.index;
            state.devices[index].state = Device.states.HIT;
            state.devices[index].player.lastHit = action.data.btnId;
            state.lastActionDeviceIndex = index;
            state.lastAction = target.TARGET_HIT;
            return state;
        case kahoot.KAHOOT_INIT:
            state.gamePin = action.data.gamePin;
            state.devices.forEach((device, index) => {
                device.player.name = action.data.devices[index].player.name;
            });
            state.lastAction = kahoot.KAHOOT_INIT;
            return state;
        case kahoot.KAHOOT_JOINED:
            state.devices[action.data.index].player.kahootSession = action.data.kahootSession;
            state.lastAction = kahoot.KAHOOT_JOINED;
            return state;
        case kahoot.KAHOOT_CLEAN_SESSIONS:
            targetPosition = action.data.targetPosition;
            state.devices.forEach((device) => {
                device.player.kahootSession.leave().then(() => {
                    device.player = new Player({name: `Player ${targetPosition}`, targetPosition});
                });
            });
        default:
            return state;
    }
}
