import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import Auth from './Auth';
import Common from './Common';
import screens from '../features/screens/screensSlice';
import accounts from '../features/accounts/accountsSlice';
import themeSettings from '../features/settings/themeSettingsSlice';
import settings from '../features/settings/settingsSlice';

const reducers = combineReducers({
  routing: routerReducer,
  auth: Auth,
  commonData: Common,
  screens,
  accounts,
  themeSettings,
  settings
});

export default reducers;
