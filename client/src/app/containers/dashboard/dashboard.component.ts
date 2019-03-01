import { GetPlayers, AddPlayer, DeletePlayer } from '../../store/actions/player.actions';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import { selectGame } from "../../store/selectors/game.selector";
import { selectPlayerList } from '../../store/selectors/player.selector';
import {Player} from "../../models/player.interface";
import {Game} from "../../models/game.interface";
import {AddGame, StartGame} from "../../store/actions/game.actions";

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  players$ = this._store.pipe(select(selectPlayerList));
  game$ = this._store.pipe(select(selectGame));

  constructor(private _store: Store<IAppState>) {}

  ngOnInit() {
    this._store.dispatch(new GetPlayers());
  }

  addGame(game: Game) {
    this._store.dispatch(new AddGame(game));
  }

  startGame() {
    this._store.dispatch(new StartGame());
  }

  addPlayer(player: Player) {
    this._store.dispatch(new AddPlayer(player));
  }

  deletePlayer(id: number) {
    this._store.dispatch(new DeletePlayer(id));
  }

  // navigateToPlayer(id: number) {
  //   this._router.navigate(['player', id]);
  // }
}
