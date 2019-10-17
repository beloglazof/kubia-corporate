import { createSlice } from 'redux-starter-kit';
import axios from '../../../util/Api';
import { setAccounts } from '../accounts/accountsSlice';

const screensSlice = createSlice({
  name: 'screens',
  initialState: { main: null, error: null },
  reducers: {
    getMainScreenSuccess(state, action) {
      state.main = action.payload;
      state.error = null;
    },
    getMainScreenFailed(state, action) {
      state.main = null;
      state.error = action.payload;
    },
  },
});

export const {
  getMainScreenSuccess,
  getMainScreenFailed,
} = screensSlice.actions;

export default screensSlice.reducer;

export const fetchMainScreen = () => async dispatch => {
  try {
    const { data } = await axios.get('compose/desktop-main-screen');
    dispatch(getMainScreenSuccess(data));
    dispatch(setAccounts(data.accounts.results));
  } catch (error) {
    dispatch(getMainScreenFailed(error.toString()));
  }
};
