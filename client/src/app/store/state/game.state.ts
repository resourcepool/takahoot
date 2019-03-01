import { Game } from '../../models/game.interface';

export interface GameState {
  game: Game;
}

export const initialGameState: GameState = {
  game: null
};
