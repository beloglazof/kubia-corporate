import { createSlice } from "redux-starter-kit";

const storageAccounts = localStorage.getItem("accounts");

const storageAccounts = localStorage.getItem('accounts')

const accountsSlice = createSlice({
  name: "accounts",
  initialState: storageAccounts ? JSON.parse(storageAccounts) : [],
  reducers: {
    setAccounts(state, action) {
      const accounts = action.payload;
      accounts.forEach((account, index) => (state[index] = account));
    }
  }
});

export const { setAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;
