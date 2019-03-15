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
        const kahootSession = new KahootSession(state.gamePin, device.player.name);
        kahootSession.joinPromise.then(() => {
            store.dispatch(actions.joined(kahootSession, device.index))
        })
    });

    // let kahootGame = new KahootGame(this.gamePin, this.players);
    // kahootGame.kahootSessionsPromise.then(() => {
    //     store.dispatch(actions.started(kahootGame));
    //     gameReset();
    //     console.info('All players joined, ready to start the game.');
    // });
}
