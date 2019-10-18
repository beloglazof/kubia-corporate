import { createSlice } from 'redux-starter-kit';

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: [],
  reducers: {
    setAccounts(state, action) {
      console.log(action)
      state.push(...action.payload)
    }
  }
})

export const {setAccounts} = accountsSlice.actions;

export default accountsSlice.reducer;