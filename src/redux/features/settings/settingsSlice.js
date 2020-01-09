import { createSlice } from '@reduxjs/toolkit';
const getFirstPagePath = () => {
  const defaultPath = '/accounts';
  const storagedPath = localStorage.getItem('firstPagePath');
  if (storagedPath) {
    return storagedPath;
  } else {
    return defaultPath;
  }
};

const settingsSlice = createSlice({
  name: 'screens',
  initialState: {
    firstPagePath: getFirstPagePath(),
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
