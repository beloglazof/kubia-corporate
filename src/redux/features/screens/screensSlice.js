import { createSlice } from '@reduxjs/toolkit';
import { getDesktopMainScreen } from '../../../api';
import { setAccounts } from '../accounts/accountsSlice';

const storageMainString = localStorage.getItem('main');
const screensSlice = createSlice({
  name: 'screens',
  initialState: {
    main: storageMainString ? JSON.parse(storageMainString) : null,
    error: null
  },
  reducers: {
    getMainScreenSuccess(state, action) {
      state.main = action.payload;
      state.error = null;
    },
    getMainScreenFailed(state, action) {
      state.main = null;
      state.error = action.payload;
    }
  }
});

export const {
  getMainScreenSuccess,
  getMainScreenFailed
} = screensSlice.actions;

export default screensSlice.reducer;

export const fetchMainScreen = () => async dispatch => {
  try {
    const data = await getDesktopMainScreen();
    if (!data) return;
    dispatch(getMainScreenSuccess(data));
    const mainString = JSON.stringify(data);
    localStorage.setItem('main', mainString);
    const accounts = data.accounts.results;
    const accountsString = JSON.stringify(accounts);
    localStorage.setItem('accounts', accountsString);
    dispatch(setAccounts(accounts));
  } catch (error) {
    dispatch(getMainScreenFailed(error.toString()));
  }
};
