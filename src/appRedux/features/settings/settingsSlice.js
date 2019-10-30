import { createSlice } from 'redux-starter-kit';

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPage: 'accounts'
  },
  reducers: {
    changeFirstPage(state, action) {
      state.firstPage = action.payload;
    }
  }
});

export const { changeFirstPage } = settingsSlice.actions;

export default settingsSlice.reducer;
