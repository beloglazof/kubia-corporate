import React from 'react';
import { Route, Switch, Redirect, Link } from 'react-router-dom';
import asyncComponent from 'util/asyncComponent';
import { Icon, Menu } from 'antd';
import { startCase } from 'lodash/string';
import { useSelector } from 'react-redux';

export const navItems = [
  { name: 'accounts', path: '/accounts', iconName: 'dollar' },
  { name: 'settings', path: '/settings', iconName: 'setting' }
];

export const renderNavigationItems = () => {
  return navItems.map(route => (
    <Menu.Item key={route.name}>
      <Link to={route.path}>
        <Icon type={route.iconName} />
        {startCase(route.name)}
      </Link>
    </Menu.Item>
  ));
};
const App = ({ match }) => {
  const { firstPagePath } = useSelector(state => state.settings);

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route exact path="/" render={() => <Redirect to={firstPagePath} />} />
        <Route
          path={`/accounts`}
          component={asyncComponent(() => import('./Accounts'))}
        />
        <Route
          path={`/new-payment`}
          component={asyncComponent(() => import('./NewPayment'))}
        />
        <Route
          path={`/settings`}
          component={asyncComponent(() => import('./Settings'))}
        />
      </Switch>
    </div>
  );
};

export default App;
