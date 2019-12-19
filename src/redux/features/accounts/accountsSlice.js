import { createSlice } from '@reduxjs/toolkit';
import { getAccounts } from '../../../api';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: localStorage.getItem('accounts')
    ? JSON.parse(localStorage.getItem('accounts'))
    : [],
  reducers: {
    setAccounts(state, action) {
      const accounts = action.payload;
      accounts.forEach((account, index) => (state[index] = account));
    },
  },
});

export const { setAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;

export const fetchAccounts = () => async dispatch => {
  try {
    const data = await getAccounts();
    if (!data) return;
    const accounts = data.results;
    const accountsString = JSON.stringify(accounts);
    localStorage.setItem('accounts', accountsString);
    dispatch(setAccounts(accounts));
  } catch (error) {
    console.error(error);
  }
};
