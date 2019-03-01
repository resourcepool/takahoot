import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  EPlayerActions,
  GetPlayers,
  GetPlayersSuccess,
  AddPlayer,
  AddPlayerSuccess,
  DeletePlayer,
  DeletePlayerSuccess
} from '../actions/player.actions';
import { PlayerService } from '../../services/player.service';
import { PlayerHttp } from '../../models/http-models/player-http.interface';

@Injectable()
export class PlayerEffects {

  @Effect()
  getPlayers$ = this._actions$.pipe(
    ofType<GetPlayers>(EPlayerActions.GET_PLAYERS),
    switchMap(() => this._playerService.getPlayers()),
    switchMap((playerHttp: PlayerHttp) => of(new GetPlayersSuccess(playerHttp.players)))
  );

  @Effect()
  addPlayer$ = this._actions$.pipe(
    ofType<AddPlayer>(EPlayerActions.ADD_PLAYER),
    switchMap((player) => this._playerService.addPlayer(player)),
    switchMap((playerHttp: PlayerHttp) => of(new AddPlayerSuccess(playerHttp.player)))
  );

  @Effect()
  deletePlayers$ = this._actions$.pipe(
    ofType<DeletePlayer>(EPlayerActions.DELETE_PLAYER),
    switchMap((id) => this._playerService.deletePlayer(id)),
    switchMap((playerHttp: PlayerHttp) => of(new DeletePlayerSuccess(playerHttp.id)))
  );

  constructor(
    private _playerService: PlayerService,
    private _actions$: Actions,
  ) {}
}
