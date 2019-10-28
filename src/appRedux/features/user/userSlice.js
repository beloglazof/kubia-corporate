import { createSlice } from "redux-starter-kit";
import { usersCheck, usersMe } from "../../../api";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser(state, action) {
      state = { ...state, ...action.payload };
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
