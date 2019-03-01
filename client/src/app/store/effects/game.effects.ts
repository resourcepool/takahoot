import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IAppState } from '../state/app.state';
import {
  EGameActions,
  AddGame,
  AddGameSuccess,
} from '../actions/game.actions';
import { GameService } from '../../services/game.service';
import { GameHttp } from '../../models/http-models/game-http.interface';

@Injectable()
export class GameEffects {

  @Effect()
  addGame$ = this._actions$.pipe(
    ofType<AddGame>(EGameActions.ADD_GAME),
    switchMap((game) => this._gameService.addGame(game)),
    switchMap((gameHttp: GameHttp) => of(new AddGameSuccess(gameHttp.game)))
  );

  constructor(
    private _gameService: GameService,
    private _actions$: Actions,
    private _store: Store<IAppState>
  ) {}
}
