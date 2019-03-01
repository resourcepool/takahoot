import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Player } from '../../models/player.interface';
import {PlayerState} from "../../store/state/player.state";

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  @Input()
  players: PlayerState;
  @Output()
  playerAdded: EventEmitter<Player> = new EventEmitter();
  @Output()
  playerDeleted: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  addPlayer(name: string) {
    this.playerAdded.emit({id: null, name: name});
  }

  deletePlayer(id: number) {
      this.playerDeleted.emit(id);
  }

  // navigateToPlayer(id: number) {
  //   this.playerSelected.emit(id);
  // }
}
