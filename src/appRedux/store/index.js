import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from '../reducers';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

const createHistory = require('history').createBrowserHistory;

const history = createHistory();
const routeMiddleware = routerMiddleware(history);

const middlewares = [thunk, routeMiddleware];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () =>
      store.replaceReducer(rootReducer)
    );
  }
  return store;
}
export { history };
