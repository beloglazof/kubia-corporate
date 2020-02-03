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
import PayPage from './Pay';
import ErrorBoundary from '../components/ErrorBoundary';
import InternalPayment from './Pay/InternalPayment';
import RemittancePayment from './Pay/RemittancePayment';
import SubmitRemittance from './Pay/SubmitRemittance';
import Reports from './Reports';
import Payrolls from './Payrolls';
import NewPayroll from './Payrolls/NewPayroll';

export const navItems = [
  { name: 'accounts', path: '/accounts', iconName: 'wallet' },
  { name: 'Pay', path: '/payments/new', iconName: 'transaction' },
  { name: 'reports', path: '/reports', iconName: 'file' },
  { name: 'transactions', path: '/transactions', iconName: 'swap' },
  { name: 'beneficiaries', path: '/beneficiaries', iconName: 'idcard' },
  { name: 'linkedPeople', path: '/linked-people', iconName: 'team' },
  { name: 'payrolls', path: '/payrolls', iconName: 'solution' },
  { name: 'settings', path: '/settings', iconName: 'setting' },
];

export const renderNavigationItems = () => {
  const activeStyles = {
    fontWeight: 'bold',
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

export const BoundaryRoute = props => {
  let history = useHistory();
  return (
    <ErrorBoundary history={history}>
      <Route {...props}>{props.children}</Route>
    </ErrorBoundary>
  );
};
const RouteNotFound = () => {
  let history = useHistory();
  const { firstPagePath } = useSelector(state => state.settings);

  return (
    <Route path="*">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={() => history.push(firstPagePath)}>
            Back Home
          </Button>
        }
      />
    </Route>
  );
};
const App = () => {
  const { firstPagePath } = useSelector(state => state.settings);
  let history = useHistory();
  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Redirect exact from="/" to={firstPagePath} />
        <BoundaryRoute path={`/accounts`} component={Accounts} />
        <BoundaryRoute exact path={`/payments/new`} component={PayPage} />
        <BoundaryRoute
          exact
          path={`/payments/new/internal`}
          component={InternalPayment}
        />
        <BoundaryRoute
          exact
          path={`/payments/new/remittance`}
          component={RemittancePayment}
        />
        <BoundaryRoute
          path={`/payments/remittance/requests/:quoteId`}
          component={SubmitRemittance}
        />
        <BoundaryRoute path={`/settings`} component={Settings} />
        <BoundaryRoute path={`/transactions`} component={Transactions} />
        <BoundaryRoute
          exact
          path={`/beneficiaries`}
          component={Beneficiaries}
        />
        <BoundaryRoute
          path={`/beneficiaries/add`}
          component={BeneficiaryAddForm}
        />
        <BoundaryRoute exact path={`/linked-people`} component={LinkedPeople} />
        <BoundaryRoute exact path={`/reports`} component={Reports} />
        <BoundaryRoute exact path={`/payrolls`} component={Payrolls} />
        <BoundaryRoute exact path={`/payrolls/new`} component={NewPayroll} />
        <RouteNotFound />
      </Switch>
    </div>
  );
};

export default App;
