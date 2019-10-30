import { createSlice } from 'redux-starter-kit';

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPage: 'accounts'
  },
  reducers: {
    setFirstPage(state, action) {
      console.log(action)
      state.firstPage = action.payload;
    }
  }
});

export const { setFirstPage } = settingsSlice.actions;

export default settingsSlice.reducer;
