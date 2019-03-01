import {EGameActions, GameActions} from '../actions/game.actions';
import {gameAdapter, GameState, initialGameState} from '../state/game.state';

export const gameReducers = (
    state = initialGameState,
    action: GameActions
): GameState => {
  switch (action.type) {
    case EGameActions.START_GAME_SUCCESS: {

      return gameAdapter.addOne(action.game, state)
    }
    case EGameActions.ADD_GAME_SUCCESS: {
      return gameAdapter.addOne(action.game, state)
    }

    default:
      return state;
  }
};
