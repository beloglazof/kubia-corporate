import { createSlice } from 'redux-starter-kit';
import Cookies from 'js-cookie';
import { logout, tokenObtain } from '../../../api';
import { setUser } from '../user/userSlice';
import { resetState } from '../../reducers';

const storageToken = Cookies.get('token');
const storageRefreshToken = Cookies.get('refreshToken');

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    token: storageToken ? storageToken : null,
    refreshToken: storageRefreshToken ? storageRefreshToken : null
  },
  reducers: {
    setSession(state, action) {
      const { token, refresh_token } = action.payload;
      Cookies.set('token', token);
      Cookies.set('refreshToken', refresh_token);
      state.token = token;
      state.refreshToken = refresh_token;
    },
    removeSession(state, action) {
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      localStorage.clear();
      state.token = null;
      state.refreshToken = null;
    }
  }
});

export const { setSession, removeSession } = sessionSlice.actions;

export default sessionSlice.reducer;

export const signIn = credentials => async dispatch => {
  const session = await tokenObtain(credentials);
  const { user, ...tokens } = session;
  dispatch(setSession(tokens));
  dispatch(setUser(user));
};

export const signOut = () => async dispatch => {
  await logout();
  dispatch(removeSession());
  dispatch(resetState());
};