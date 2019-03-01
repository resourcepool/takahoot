import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Game } from '../../models/game.interface';

@Component({
  selector: 'app-game-pin',
  templateUrl: './game-pin.component.html',
  styleUrls: ['./game-pin.component.css']
})
export class GamePinComponent implements OnInit {
  @Input()
  game: Game;
  @Output()
  gameSetted: EventEmitter<Game> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  addGame(pin: string) {
    this.gameSetted.emit({pin});
  }

}
