import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import 'assets/vendors/style';
import 'styles/wieldy.less';

import configureStore from './appRedux/store';
import App from './containers/App';

export const store = configureStore();

const Root = () => (
  <Provider store={store}>
    <Router>
      <Route path='/' component={App} />
    </Router>
  </Provider>
);

const renderApp = () => {
  ReactDOM.render(<Root />, document.getElementById('root'));
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept(renderApp);
}

renderApp();
