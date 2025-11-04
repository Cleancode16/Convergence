import { signin, signup } from '../../services/authService';

export const signinAction = (email, password, role) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_REQUEST' });
    const data = await signin(email, password, role);
    dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
    localStorage.setItem('userInfo', JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const signupAction = (name, email, password, role) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_REQUEST' });
    const data = await signup(name, email, password, role);
    dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
    localStorage.setItem('userInfo', JSON.stringify(data.data));
    return data.data;
  } catch (error) {
    dispatch({
      type: 'AUTH_FAIL',
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: 'LOGOUT' });
};

export const clearError = () => (dispatch) => {
  dispatch({ type: 'CLEAR_ERROR' });
};
