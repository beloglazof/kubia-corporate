import { createSlice } from 'redux-starter-kit';

const storageAccounts = localStorage.getItem('accounts')

const accountsSlice = createSlice({
  name: 'accounts',
  initialState: storageAccounts ? JSON.parse(storageAccounts) : [] ,
  reducers: {
    setAccounts(state, action) {
      console.log(action)
      state = action.payload
    }
  }
})

export const {setAccounts} = accountsSlice.actions;

export default accountsSlice.reducer;