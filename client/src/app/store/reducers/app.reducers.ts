import { ActionReducerMap } from '@ngrx/store';

import { routerReducer } from '@ngrx/router-store';
import { IAppState } from '../state/app.state';
import { configReducers } from './config.reducers';
import { gameReducers } from './game.reducers';
import { playerReducers } from './player.reducers';

export const appReducers: ActionReducerMap<IAppState, any> = {
  router: routerReducer,
  game: gameReducers,
  players: playerReducers,
  config: configReducers
};
