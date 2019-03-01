import { RouterReducerState } from '@ngrx/router-store';

import { GameState, initialGameState } from './game.state';
import { PlayerState, initialPlayerState } from './player.state';
import { initialConfigState, IConfigState } from './config.state';


export interface IAppState {
  router?: RouterReducerState;
  game: GameState;
  players: PlayerState;
  config: IConfigState;
}

export const initialAppState: IAppState = {
  game: initialGameState,
  players: initialPlayerState,
  config: initialConfigState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
