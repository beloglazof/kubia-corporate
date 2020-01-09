import { combineReducers } from 'redux';
import Common from './Common';
import screens from '../features/screens/screensSlice';
import accounts from '../features/accounts/accountsSlice';
import themeSettings from '../features/settings/themeSettingsSlice';
import settings from '../features/settings/settingsSlice';
import session from '../features/session/sessionSlice';
import user from '../features/user/userSlice';
import transactions from './Transactions';

const reducers = combineReducers({
  commonData: Common,
  screens,
  accounts,
  themeSettings,
  settings,
  session,
  user,
  transactions,
});

const RESET_STATE = 'RESET_STATE';

export const resetState = () => ({ type: RESET_STATE });

const rootReducer = (state, action) => {
  if (action.type === RESET_STATE) {
    state = {
      ...state,
      commonData: undefined,
      screens: undefined,
      accounts: undefined,
      session: undefined,
      user: undefined,
      transactions: undefined,
    };
  }
  return reducers(state, action);
};
export default rootReducer;
