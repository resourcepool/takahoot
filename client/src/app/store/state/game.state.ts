import { Game } from '../../models/game.interface';
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface GameState extends EntityState<Game> { }

export const gameAdapter = createEntityAdapter<Game>();

export const initialGameState: GameState = gameAdapter.getInitialState({
  ids: [],
  entities: {}
});
