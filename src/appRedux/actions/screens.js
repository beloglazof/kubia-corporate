import {
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
} from '../../constants/ActionTypes';
import axios from 'util/Api';

export const getMainScreen = () => {
  return dispatch => {
    dispatch({ type: FETCH_START });
    axios
      .get('compose/desktop-main-screen')
      .then(({ data }) => {
        console.log('response:', data);
        // const { token, refresh_token } = data;
        if (data) {
          // Cookies.set('token', token);
          // Cookies.set('refreshToken', refresh_token);
          // axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
          dispatch({ type: FETCH_SUCCESS });
          // dispatch({ type: USER_TOKEN_SET, payload: token });
          // dispatch({ type: USER_DATA, payload: data.user });
        } else {
          dispatch({ type: FETCH_ERROR, payload: data.error });
        }
      })
      .catch(function(error) {
        dispatch({ type: FETCH_ERROR, payload: error.message });
        console.log('Error****:', error.message);
      });
  };
};
