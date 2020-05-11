const initialState = {
  data: null,
  errors: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'analyzeData:set':
      return {
        data: action.payload.data,
        errors: null,
      };

    case 'analyzeData:errors':
      return {
        errors: action.payload.errors,
      };

    default:
      return state;
  }
};
