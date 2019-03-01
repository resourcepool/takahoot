import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {IAppState} from '../state/app.state';
import {AddGame, AddGameSuccess, EGameActions, StartGame, StartGameSuccess} from '../actions/game.actions';
import {GameService} from '../../services/game.service';
import {GameHttp} from '../../models/http-models/game-http.interface';

@Injectable()
export class GameEffects {

  @Effect()
  getGame$ = this._actions$.pipe(
      ofType<StartGame>(EGameActions.START_GAME),
      switchMap(() => this._gameService.getGame()),
      switchMap((gameHttp: GameHttp) => of(new StartGameSuccess(gameHttp.game)))
  );

  @Effect()
  addGame$ = this._actions$.pipe(
      ofType<AddGame>(EGameActions.ADD_GAME),
      switchMap((game) => this._gameService.addGame(game)),
      switchMap((gameHttp: GameHttp) => of(new AddGameSuccess(gameHttp.game)))
  );

  constructor(
      private _gameService: GameService,
      private _actions$: Actions
  ) {
  }
}
