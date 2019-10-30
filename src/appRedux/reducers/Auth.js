import {
  INIT_URL,
  SIGNOUT_USER_SUCCESS,
  USER_DATA,
  USER_TOKEN_SET,
} from '../../constants/ActionTypes';
import Cookies from 'js-cookie';

const token = Cookies.get('token') || null;
const initialState = {
  token,
  initURL: '',
  authUser: JSON.parse(localStorage.getItem('user')),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case INIT_URL: {
      return { ...state, initURL: action.payload };
    }

    case SIGNOUT_USER_SUCCESS: {
      return {
        ...state,
        token: null,
        authUser: null,
        initURL: '',
      };
    }

    case USER_DATA: {
      return {
        ...state,
        authUser: action.payload,
      };
    }

    case USER_TOKEN_SET: {
      return {
        ...state,
        token: action.payload,
      };
    }

    default:
      return state;
  }
};
