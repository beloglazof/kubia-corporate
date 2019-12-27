import { createSlice } from '@reduxjs/toolkit';
import { getAccounts } from '../../../api';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: localStorage.getItem('accounts') ? JSON.parse(localStorage.getItem('accounts')) : [],
  // initialState: [],
  reducers: {
    setAccounts(state, action) {
      const accounts = action.payload;
      state.splice(0, state.length)
      state.push(...accounts);
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
    dispatch(setAccounts(accounts));

    const stringifiedAccounts = JSON.stringify(accounts);
    localStorage.setItem('accounts', stringifiedAccounts);
  } catch (error) {
    console.error(error);
  }
};
