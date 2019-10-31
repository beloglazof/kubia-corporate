import { createSlice } from 'redux-starter-kit';

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPagePath: '/accounts'
  },
  reducers: {
    setFirstPage(state, action) {
      state.firstPagePath = action.payload;
    }
  }
});

export const { setFirstPage } = settingsSlice.actions;

export default settingsSlice.reducer;
