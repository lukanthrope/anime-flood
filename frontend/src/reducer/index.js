const initialState = {
  showSpinner: false,
  user: localStorage.getItem('user') === 'null' ? null : localStorage.getItem('user'),
};

function reducer(state = initialState, action) {
  switch(action.type) {
    case 'SHOW_SPINNER':
      return {
        ...state,
        showSpinner: !state.showSpinner,
      };
    case 'AUTHORIZE':
      return {
        ...state,
        user: action.payload.username,
      };
    default:
      return state;
  }
};

export default reducer;
