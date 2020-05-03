import Firebase from '../../firebase/Firebase';
import * as actionTypes from './actionTypes'

export const requestLogin = () => {
    return {
      type: actionTypes.LOGIN_REQUEST
    };
  };

export const receiveLogin = user => {
    return {
      type: actionTypes.LOGIN_SUCCESS,
      user
    };
  };

export const loginError = (error) => {
    return {
      type: actionTypes.LOGIN_FAILURE,
      error: error
    };
  };

export const requestLogout = () => {
    return {
      type: actionTypes.LOGOUT_REQUEST
    };
  };
  
export const receiveLogout = () => {
    return {
      type: actionTypes.LOGOUT_SUCCESS
    };
  };
  
export const logoutError = () => {
    return {
      type: actionTypes.LOGOUT_FAILURE
    };
  };

export const verifyRequest = () => {
    return {
      type:actionTypes.VERIFY_REQUEST
    };
  };

export const verifySuccess = () => {
    return {
      type: actionTypes.VERIFY_SUCCESS
    };
  };

export const logoutUser = () => dispatch => {
    dispatch(requestLogout());
    Firebase.auth().signOut()
      .then(() => {
        dispatch(receiveLogout());
      })
      .catch(error => {
        dispatch(logoutError());
      });
  };

// export const checkAuthTimeout = (expirationTime) => {
//     return dispatch => {
//         setTimeout(() => {
//             dispatch(logout());
//         }, expirationTime * 1000);
//     };
// };

export const loginUser = (email, password) => dispatch => {
    dispatch(requestLogin());
    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(receiveLogin(user));
      })
      .catch(error => {
        dispatch(loginError(error));
      });
  };

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const verifyAuth = () => dispatch => {
    dispatch(verifyRequest());
    Firebase.auth().onAuthStateChanged(user => {
      if (user !== null) {
        dispatch(receiveLogin(user));
      }
      dispatch(verifySuccess());
    }
    );
  };