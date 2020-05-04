import { combineReducers } from 'redux';

import handleIndex from './indexesReducer';
import handlePlayer from './playerReducer';
import handleBonuses from './bonusReducer';

const rootReducer = combineReducers({
  handleIndex,
	handlePlayer,
  handleBonuses
})

export default rootReducer;
