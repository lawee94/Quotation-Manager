import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Reducer from './store/reducers/reducer';
import AuthReducer from './store/reducers/auth';
import { verifyAuth } from './store/actions/auth';

const rootReducer = combineReducers({
    auth: AuthReducer,
    reduc: Reducer
})

export  const configureStore = (persistedState) => {
    const store = createStore(rootReducer, applyMiddleware(thunk));
    store.dispatch(verifyAuth())
    return store
}

const app = (
        <Provider store={configureStore()}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note firebase comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
