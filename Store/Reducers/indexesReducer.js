const initialState = {
  indexes:
  {
    playerIndex: 0,
    questionIndex: 0,
    roundLength: 0,
    roundIndicator: 0,
    roundIndex: 1,
  }
};

function handleIndex(state = initialState, action){
   let nextState;

   switch (action.type) {
     case 'SET_GAME':
        nextState = {
          ...state,
          indexes: {...state.indexes}
        }
        const {playerIndex,questionIndex, roundLength,roundIndex,roundIndicator} = action.value

        nextState.indexes = {
          playerIndex,
          questionIndex,
          roundLength,
          roundIndex,
          roundIndicator
        }
        return nextState;

      case 'INCREMENT_ROUND_INDICATOR':
        nextState = {
          ...state,
          indexes: {...state.indexes}
        }

        nextState.indexes = {
          playerIndex: state.indexes.playerIndex,
          questionIndex: state.indexes.questionIndex,
          roundLength: state.indexes.roundLength,
          roundIndex: state.indexes.roundIndex,
          roundIndicator: 2
        };
        return nextState;

    case 'SET_ROUND_INDEX':
        nextState = {
          ...state,
          indexes: {...state.indexes}
        }

        nextState.indexes = {
          roundIndex: state.indexes.roundIndex + 1,
          roundIndicator: 0
        }

        return nextState;
     default:
        return state;
   }
}

export default handleIndex;
