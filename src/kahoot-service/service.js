import {store} from '@/shared/store';
import * as actions from "./actions";
import {gameReset} from "@/target-service/service";
import KahootSession from './KahootSession';

export function init(gamePin, devices) {
    store.dispatch(actions.init(gamePin, devices));
}

export function play() {
    const state = store.getState();
    state.devices.forEach(device => {
        const kahootSession = new KahootSession(state.gamePin, device.player.name, device.player.targetPosition);
        kahootSession.joinPromise.then(() => {
            store.dispatch(actions.joined(kahootSession, device.index))
        })
    });
}

export function clean() {
    store.dispatch(actions.clean())
}
