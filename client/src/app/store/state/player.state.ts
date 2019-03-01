import { Player } from '../../models/player.interface';
import {createEntityAdapter, EntityState} from "@ngrx/entity";

export interface PlayerState extends EntityState<Player> { }

export const playerAdapter = createEntityAdapter<Player>();

export const initialPlayerState: PlayerState = playerAdapter.getInitialState({
  ids: [],
  entities: {}
});
