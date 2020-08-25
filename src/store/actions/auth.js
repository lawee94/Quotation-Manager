import Firebase, { signInWithGoogle } from "../../firebase/Firebase";
import * as actionTypes from "./actionTypes";

export const requestLogin = () => {
  return {
    type: actionTypes.LOGIN_REQUEST,
  };
};

export const receiveLogin = (user) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    user,
  };
};

export const loginError = (error) => {
  return {
    type: actionTypes.LOGIN_FAILURE,
    error: error,
  };
};

export const requestLogout = () => {
  return {
    type: actionTypes.LOGOUT_REQUEST,
  };
};

export const receiveLogout = () => {
  return {
    type: actionTypes.LOGOUT_SUCCESS,
  };
};

export const logoutError = () => {
  return {
    type: actionTypes.LOGOUT_FAILURE,
  };
};

export const verifyRequest = () => {
  return {
    type: actionTypes.VERIFY_REQUEST,
  };
};

export const verifySuccess = () => {
  return {
    type: actionTypes.VERIFY_SUCCESS,
  };
};

export const logoutUser = () => (dispatch) => {
  dispatch(requestLogout());
  Firebase.auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch((error) => {
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

export const loginUser = (email, password) => (dispatch) => {
  authUser(email, password, "sign", dispatch);
};

export const register = (email, password) => (dispatch) => {
  authUser(email, password, "reg", dispatch);
};

export const authUser = (email, password, type, dispatch) => {
  dispatch(requestLogin());
  let auth =
    type === "reg"
      ? Firebase.auth().createUserWithEmailAndPassword(email, password)
      : Firebase.auth().signInWithEmailAndPassword(email, password);
  auth
    .then((user) => {
      dispatch(receiveLogin(user));
    })
    .catch((error) => {
      let err = errorControl(error);
      dispatch(loginError(err));
    });
};

export const loginWithGoogle = () => (dispatch) => {
  signInWithGoogle()
    .then((user) => {
      dispatch(receiveLogin(user));
    })
    .catch((error) => {
      let err = errorControl(error);
      dispatch(loginError(err));
    });
};

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const verifyAuth = () => (dispatch) => {
  dispatch(verifyRequest());
  Firebase.auth().onAuthStateChanged((user) => {
    if (user !== null) {
      dispatch(receiveLogin(user));
    }
    dispatch(verifySuccess());
  });
};

export const errorControl = (err) => {
  let errName = "";
  switch (err.code) {
    case "auth/user-disabled":
      errName = "Account Disabled";
      break;
    case "auth/web-storage-unsupported":
      errName = "Browser Error.. Use Aother Browser";
      break;
    case "auth/too-many-requests":
      errName = "Too many attempt....try again later";
      break;
    case "auth/network-request-failed":
      errName = "Network Error..Check your connection";
      break;
    case "auth/popup-closed-by-user":
      errName = "Error logging in..Try again";
      break;
    default:
      errName = err.message;
  }
  return errName;
};
