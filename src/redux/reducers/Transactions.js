import { UPDATE_LIST } from '../../constants/ActionTypes';

const initState = {
  transList: [],
  filteredList: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case UPDATE_LIST: {
      return {
        ...state,
        transList: action.transList,
      };
    }
    default: return (state);
  }
};
