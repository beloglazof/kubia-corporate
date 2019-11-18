import { UPDATE_LIST } from '../../constants/ActionTypes';
import { getTransactions } from '../../api';

const updateList = newList => ({
  type: UPDATE_LIST,
  transList: newList
});

export const fetchList = () => async dispatch => {
  const response = await getTransactions();
  dispatch(updateList(response.results));
};
