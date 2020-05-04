const initialState = {
  bonus:
  {
    bonusActive: false,
    roundIndicator: 6
  }
}

function handleBonuses(state = initialState, action){
  let nextState;

  switch (action.type) {
    case 'SET_BONUS':

      nextState = {
        ...state,
        bonus: {...state.bonus}
      }

      const {bonusActive, roundIndicator} = action.value
      nextState.bonus = {
        bonusActive,
        roundIndicator
      }

      return nextState;
    default:
      return state;
  }
}
export default handleBonuses
