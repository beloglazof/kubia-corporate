import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import 'react-phone-input-2/lib/semantic-ui.css';
import 'typeface-roboto';
import './index.css';
import App from './components/App';


const Root = () => (
  <Router>
    <App />
  </Router>
);

const renderApp = () => {
  ReactDOM.render(<Root />, document.getElementById('root'));
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./containers/App', renderApp);
}

renderApp();
