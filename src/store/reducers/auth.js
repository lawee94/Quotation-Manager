import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../func';

const initialState = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    isAuthenticated: false,
    user: {},
    loading: false,
    authRedirectPath: '/home'
};

const loginRequest = (state, action) => {
    return updateObject( state, { error: null, isLoggingIn: true, loading: true } );
};
const logoutRequest = (state, action) => {
    return updateObject( state, { error: null, isLoggingOut: true, loading: true } );
};

const loginSuccess = (state, action) => {
    return updateObject( state, { 
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.user,
        error: null,
        loading: false
     } );
};

const logoutSuccess = (state, action) => {
    return updateObject( state, { 
        isLoggingOut: false,
        isAuthenticated: false,
        user: {},
        error: null,
        loading: false
     } );
};

const loginFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false,
        isLoggingIn: false,
        isAuthenticated: false
    });
};

const logoutFail = (state, action) => {
    return updateObject( state, {
        error: action.error,
        loading: false,
        isLoggingOut: false,
        isAuthenticated: true
    });
};

const verifyRequest = (state, action) => {
    return updateObject( state, {
        isVerifying: true,
        error: null
    })
}

const verifySuccess = (state, action) => {
    return updateObject( state, {
        isVerifying: false,
        error: null
    })
}

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirectPath: action.path })
}

const authReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.LOGIN_REQUEST: return loginRequest(state, action);
        case actionTypes.LOGIN_SUCCESS: return loginSuccess(state, action);
        case actionTypes.LOGIN_FAILURE: return loginFail(state, action);

        case actionTypes.LOGOUT_REQUEST: return logoutRequest(state, action);
        case actionTypes.LOGOUT_SUCCESS: return logoutSuccess(state, action);
        case actionTypes.LOGOUT_FAILURE: return logoutFail(state, action);

        case actionTypes.VERIFY_REQUEST: return verifyRequest(state, action);
        case actionTypes.VERIFY_SUCCESS: return verifySuccess(state, action);

        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state,action);
        default:
            return state;
    }
};

export default authReducer;