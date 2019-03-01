import { Player } from '../player.interface';

export interface PlayerHttp {
  players: Player[];
  player: Player;
  id: number;
}
