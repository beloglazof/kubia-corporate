import { GET_MAIN_SCREEN } from '../../constants/ActionTypes';

const initalState = {
  main: null,
};

export default (state = initalState, action) => {
  switch (action.type) {
    case GET_MAIN_SCREEN:
      return {
        ...state,
        main: action.payload,
      };

    default:
      return state;
  }
};
