import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPagePath: localStorage.getItem('firstPagePath')
      ? localStorage.getItem('firstPagePath')
      : '/accounts',
  },
  reducers: {
    setFirstPagePath(state, action) {
      localStorage.setItem('firstPagePath', action.payload);
      state.firstPagePath = action.payload;
    },
  },
});

export const { setFirstPagePath } = settingsSlice.actions;

export default settingsSlice.reducer;
