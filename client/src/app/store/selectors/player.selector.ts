import {createSelector} from '@ngrx/store';

import {IAppState} from '../state/app.state';
import {PlayerState} from '../state/player.state';

export const selectPlayerList = createSelector(
    (state: IAppState) => state.players,
    (state: PlayerState) => state
);
