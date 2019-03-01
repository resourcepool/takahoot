import { Action } from '@ngrx/store';

import { Player } from '../../models/player.interface';

export enum EPlayerActions {
  GET_PLAYERS = '[Player] Get Players',
  GET_PLAYERS_SUCCESS = '[Player] Get Players Success',
  GET_PLAYER = '[Player] Get Player',
  GET_PLAYER_SUCCESS = '[Player] Get Player Success',
  ADD_PLAYER = '[Player] Add Player',
  ADD_PLAYER_SUCCESS = '[Player] Add Player Success',
  DELETE_PLAYER = '[Player] Delete Player',
  DELETE_PLAYER_SUCCESS = '[Player] Delete Player Success'
}

export class GetPlayers implements Action {
  public readonly type = EPlayerActions.GET_PLAYERS;
}

export class GetPlayersSuccess implements Action {
  public readonly type = EPlayerActions.GET_PLAYERS_SUCCESS;
  constructor(public players: Player[]) {}
}

export class GetPlayer implements Action {
  public readonly type = EPlayerActions.GET_PLAYER;
  constructor(public playerId: number) {}
}

export class GetPlayerSuccess implements Action {
  public readonly type = EPlayerActions.GET_PLAYER_SUCCESS;
  constructor(public player: Player) {}
}

export class AddPlayer implements Action {
  public readonly type = EPlayerActions.ADD_PLAYER;
  constructor(public player: Player) {}
}

export class AddPlayerSuccess implements Action {
  public readonly type = EPlayerActions.ADD_PLAYER_SUCCESS;
  constructor(public player: Player) {}
}

export class DeletePlayer implements Action {
  public readonly type = EPlayerActions.DELETE_PLAYER;
  constructor(public playerId: number) {}
}

export class DeletePlayerSuccess implements Action {
  public readonly type = EPlayerActions.DELETE_PLAYER_SUCCESS;
  constructor(public playerId: number) {}
}

export type PlayerActions = GetPlayers | GetPlayersSuccess | GetPlayer | GetPlayerSuccess | AddPlayer | AddPlayerSuccess | DeletePlayer | DeletePlayerSuccess;
