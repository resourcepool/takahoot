import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { PlayerState } from '../state/player.state';

const selectPlayers = (state: IAppState) => state.players;

export const selectPlayerList = createSelector(
  selectPlayers,
  (state: PlayerState) => state
);
