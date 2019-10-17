import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { Route, Switch, Router } from 'react-router-dom';

import 'assets/vendors/style';
import 'styles/wieldy.less';

import configureStore, { history } from './appRedux/store';
import App from './containers/App';

import registerServiceWorker from './registerServiceWorker';
export const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App} />
    </Router>
  </Provider>
);

const renderApp = () => {
  ReactDOM.render(<Root />, document.getElementById('root'));
};

// Do this once
// registerServiceWorker();

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept(renderApp);
}

renderApp();
