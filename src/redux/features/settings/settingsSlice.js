import { createSlice } from '@reduxjs/toolkit';

const storageFirstPagePath = localStorage.getItem('firstPagePath');
const firstPagePath = storageFirstPagePath ? storageFirstPagePath : '/accounts';

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPagePath
  },
  reducers: {
    setFirstPagePath(state, action) {
      localStorage.setItem('firstPagePath', action.payload);
      state.firstPagePath = action.payload;
    }
  }
});

export const { setFirstPagePath } = settingsSlice.actions;

export default settingsSlice.reducer;
