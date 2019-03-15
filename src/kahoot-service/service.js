import {store} from '@/shared/store';
import * as actions from "./actions";
import {gameReset} from "@/target-service/service";

export function init(gamePin, devices) {
    store.dispatch(actions.init(gamePin, devices));
}

export function play() {
    let kahootGame = new KahootGame(this.gamePin, this.players);
    kahootGame.kahootSessionsPromise.then(() => {
        store.dispatch(actions.started(kahootGame));
        gameReset();
        console.info('All players joined, ready to start the game.');
    });
}
