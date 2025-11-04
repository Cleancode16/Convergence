const initialState = {
  userInfo: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_REQUEST':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, userInfo: action.payload, error: null };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, userInfo: null, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};
