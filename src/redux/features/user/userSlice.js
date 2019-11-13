import { createSlice } from 'redux-starter-kit';
import { usersMe } from '../../../api';

const storageUser = localStorage.getItem('user');

const userSlice = createSlice({
  name: 'user',
  initialState: storageUser ? JSON.parse(storageUser) : {},
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      if (!user) {
        return state;
      }
      const userStringified = JSON.stringify(user);
      localStorage.setItem('user', userStringified);
      return (state = { ...state, ...user });
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;

export const fetchUser = () => async dispatch => {
  try {
    const user = await usersMe();
    dispatch(setUser(user));
  } catch (error) {}
};
