import React from 'react';
import { NavLink, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Button, Icon, Menu, Result } from 'antd';
import { startCase } from 'lodash/string';
import { useSelector } from 'react-redux';

import Transactions from '../components/Transactions';
import Accounts from './Accounts';
import Settings from './Settings';
import Beneficiaries from './Beneficiaries';
import BeneficiaryAddForm from '../components/BeneficiaryAddForm';
import LinkedPeople from './LinkedPeople';
import NewPayment from './Pay';

export const navItems = [
  { name: 'accounts', path: '/accounts', iconName: 'wallet' },
  { name: 'pay', path: '/new-payment', iconName: 'transaction' },
  { name: 'transactions', path: '/transactions', iconName: 'swap' },
  { name: 'beneficiaries', path: '/beneficiaries', iconName: 'idcard' },
  { name: 'linkedPeople', path: '/linked-people', iconName: 'team' },
  { name: 'settings', path: '/settings', iconName: 'setting' }
];

export const renderNavigationItems = () => {
  const activeStyles = {
    fontWeight: 'bold'
  };
  const renderItem = route => {
    const showIcon = route.iconName && route.iconName.length > 0;
    return (
      <Menu.Item key={route.path}>
        <NavLink activeStyle={activeStyles} to={route.path}>
          {showIcon && <Icon type={route.iconName} />}
          {startCase(route.name)}
        </NavLink>
      </Menu.Item>
    );
  };
  return navItems.map(renderItem);
};
const App = () => {
  const { firstPagePath } = useSelector(state => state.settings);
  let history = useHistory();
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Redirect exact from="/" to={firstPagePath} />
        <Route path={`/accounts`} component={Accounts} />
        <Route path={`/new-payment`} component={NewPayment} />
        <Route path={`/settings`} component={Settings} />
        <Route path={`/transactions`} component={Transactions} />
        <Route exact path={`/beneficiaries`} component={Beneficiaries} />
        <Route path={`/beneficiaries/add`} component={BeneficiaryAddForm} />
        <Route exact path={`/linked-people`} component={LinkedPeople} />
        <Route path="*">
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Button
                type="primary"
                onClick={() => history.push(firstPagePath)}
              >
                Back Home
              </Button>
            }
          />
        </Route>
      </Switch>
    </div>
  );
};

export default App;
