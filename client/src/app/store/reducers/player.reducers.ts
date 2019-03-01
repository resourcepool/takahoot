import {EPlayerActions, PlayerActions} from '../actions/player.actions';
import {initialPlayerState, playerAdapter, PlayerState} from '../state/player.state';

export const playerReducers = (
  state = initialPlayerState,
  action: PlayerActions
): PlayerState => {
  switch (action.type) {
    case EPlayerActions.GET_PLAYERS_SUCCESS: {
      return playerAdapter.addAll(action.players, state)
    }
    case EPlayerActions.ADD_PLAYER_SUCCESS: {
      return playerAdapter.addOne(action.player, state)
    }
    case EPlayerActions.DELETE_PLAYER_SUCCESS: {
      return playerAdapter.removeOne(action.playerId, state)
    }

    default:
      return state;
  }
};
