import * as api from './analyze.api';

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
    dispatch({ type: 'analyzeData:errors', payload: { errors } });
  }
};
