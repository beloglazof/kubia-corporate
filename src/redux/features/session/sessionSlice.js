import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import Cookies from 'js-cookie';
import { logout, tokenObtain, tokenRefresh, twoFactorAuth } from '../../../api';
import { resetState } from '../../reducers';
import { setUser } from '../user/userSlice';

const storageToken = Cookies.get('token');
const storageRefreshToken = Cookies.get('refreshToken');

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    token: storageToken ? storageToken : null,
    refreshToken: storageRefreshToken ? storageRefreshToken : null,
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
      localStorage.removeItem('user');
      localStorage.removeItem('main');
      localStorage.removeItem('accounts');
      state.token = null;
      state.refreshToken = null;
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    },
  },
});

export const { setSession, removeSession } = sessionSlice.actions;

export default sessionSlice.reducer;

let secret;

export const signIn = credentials => async dispatch => {
  const session = await tokenObtain(credentials);
  if (!session) {
    return;
  }

  if (session['2fa']) {
    secret = session['2fa_secret'];
    return 'TWO_FACTOR_AUTH';
  }

  const { user, ...tokens } = session;

  if (user.type?.toLowerCase() === 'customer') {
    message.info('You are not corporate user');
    return;
  }

  dispatch(setSession(tokens));
  dispatch(setUser(user));
};

export const submitSignIn = code => async dispatch => {
  const session = await twoFactorAuth(secret, code);
  if (!session) {
    return;
  }

  const { user, ...tokens } = session;

  if (user.type?.toLowerCase() === 'customer') {
    message.info('You are not corporate user');
    return;
  }

  dispatch(setSession(tokens));
  dispatch(setUser(user));
};

export const signOut = () => async dispatch => {
  await logout();
  dispatch(removeSession());
  dispatch(resetState());
};

export const getNewToken = () => async dispatch => {
  const params = { refresh_token: storageRefreshToken };
  const session = await tokenRefresh(params);
  const { token, refresh_token } = session;
  dispatch(setSession({ token, refresh_token }));
};
