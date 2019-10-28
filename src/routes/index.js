import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import asyncComponent from 'util/asyncComponent';

const App = ({ match }) => (
  <div className='gx-main-content-wrapper'>
    <Switch>
      <Route exact path='/' render={() => <Redirect to='/accounts' />} />
      <Route
        path={`${match.url}accounts`}
        component={asyncComponent(() => import('./Accounts'))}
      />
      <Route
        path={`${match.url}new-payment`}
        component={asyncComponent(() => import('./NewPayment'))}
      />
    </Switch>
  </div>
);

export default App;
