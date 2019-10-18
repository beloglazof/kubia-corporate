import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Settings from './Settings';
import Auth from './Auth';
import Common from './Common';
import screens from '../features/screens/screensSlice';
import accounts from '../features/accounts/accountsSlice';

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  commonData: Common,
  screens,
  accounts
});

export default reducers;
