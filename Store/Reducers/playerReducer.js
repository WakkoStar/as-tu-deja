const initialState = {players: [{id: 0, name: "", score:0, question:0 }]};

function handlePlayer(state = initialState, action){

  let nextState;

  switch (action.type) {
    case 'ADD_PLAYER':
      nextState = {
        ...state,
        players: [...state.players,action.value]
      }
      return nextState;

    case 'MODIFY_PLAYER':
      nextState = {
        ...state,
        players: [...state.players]
      }
      nextState.players.map(
        (player, index) => {
          if(player.id === action.value.id) player.name = action.value.name
        }
      )
      return nextState;

    case 'SUPPR_PLAYER':
      const playerIndex = state.players.findIndex(item => item.id === action.value.id);

      nextState = {
        ...state,
        players: state.players.filter((player, index) => index !== playerIndex)
      }
      return nextState;

    case 'NEXT_QUESTION':
      nextState = {
        ...state,
        players: [...state.players]
      }
      nextState.players.map(
        (player, index) => {
          if(player.id === action.value.id){
            player.score = action.value.score
            player.question = action.value.question
        }}
      )

      return nextState;

    case 'RESET_PLAYER':
      nextState = {
        ...state,
        players: [...state.players]
      }
      nextState.players.map(
        (player, index) => {
            player.score = 0
            player.question = 0
        }
      )

      return nextState;

    case 'CLEAR_PLAYER' :
      nextState = {
        players:[]
      }

      return nextState;

    default:
    return state;

  }

}

export default handlePlayer;
