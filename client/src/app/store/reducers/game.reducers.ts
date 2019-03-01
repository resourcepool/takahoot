import { EGameActions } from '../actions/game.actions';
import { GameActions } from '../actions/game.actions';
import { initialGameState, GameState } from '../state/game.state';

export const gameReducers = (
  state = initialGameState,
  action: GameActions
): GameState => {
  switch (action.type) {
    case EGameActions.ADD_GAME_SUCCESS: {
      return {
        ...state,
        game: action.payload
      };
    }

    default:
      return state;
  }
};
