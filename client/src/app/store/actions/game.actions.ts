import { Action } from '@ngrx/store';

import { Game } from '../../models/game.interface';

export enum EGameActions {
  ADD_GAME = '[Game] Add Game',
  ADD_GAME_SUCCESS = '[Game] Add Game Success',
  START_GAME = '[Game] Start Game',
  START_GAME_SUCCESS = '[Game] Start Game Success'
}

export class AddGame implements Action {
  public readonly type = EGameActions.ADD_GAME;
  constructor(public payload: Game) {}
}

export class AddGameSuccess implements Action {
  public readonly type = EGameActions.ADD_GAME_SUCCESS;
  constructor(public payload: Game) {}
}

export class StartGame implements Action {
  public readonly type = EGameActions.START_GAME;
  constructor() {}
}

export class StartGameSuccess implements Action {
  public readonly type = EGameActions.START_GAME_SUCCESS;
  constructor(public payload: Game) {}
}

export type GameActions = AddGame | AddGameSuccess | StartGame | StartGameSuccess;
