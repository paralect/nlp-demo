import * as api from './analyze.api';
import { addErrorMessage } from '../toast/toast.actions';

export const analyzeData = ({
  text,
  image,
}) => async (dispatch) => {
  try {
    const { data } = await api.analyzeData({
      text,
      image,
    });
    dispatch({ type: 'analyzeData:set', payload: { data } });
  } catch (response) {
    const { errors } = response.data;

    if (errors[0]._global) {
      dispatch(addErrorMessage('Processing error', errors[0]._global));
    } else {
      dispatch({ type: 'analyzeData:errors', payload: { errors } });
    }
  }
};
