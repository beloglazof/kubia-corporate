import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCcMastercard } from '@fortawesome/free-brands-svg-icons';

import 'typeface-roboto';
import './index.css';
import 'assets/vendors/style';
import 'styles/wieldy.less';

import configureStore from './appRedux/store';
import App from './containers/App';

library.add(faCcMastercard);
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
