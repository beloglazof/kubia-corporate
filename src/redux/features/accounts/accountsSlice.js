import { createSlice } from '@reduxjs/toolkit';
import { getAccounts } from '../../../api';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: [],
  reducers: {
    setAccounts(state, action) {
      const accounts = action.payload;
      state.length = 0;
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
  } catch (error) {
    console.error(error);
  }
};
