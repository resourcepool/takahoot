import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { GameState } from '../state/game.state';

export const selectGame = createSelector(
  (state: IAppState) => state.game,
  (state: GameState) => state.game
);
