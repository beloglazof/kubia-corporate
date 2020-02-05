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
import SubMenu from 'antd/lib/menu/SubMenu';
import IntlMessages from '../util/IntlMessages';

const categories = [
  { name: 'money', iconName: 'dollar' },
  { name: 'people', iconName: 'global' },
];

export const navItems = [
  {
    name: 'accounts',
    path: '/accounts',
    iconName: 'wallet',
    category: 'money',
  },
  {
    name: 'pay',
    path: '/payments/new',
    iconName: 'transaction',
    category: 'money',
  },
  {
    name: 'transactions',
    path: '/transactions',
    iconName: 'swap',
    category: 'money',
  },
  {
    name: 'beneficiaries',
    path: '/beneficiaries',
    iconName: 'idcard',
    category: 'people',
  },
  {
    name: 'linkedPeople',
    path: '/linked-people',
    iconName: 'team',
    category: 'people',
  },
  { name: 'reports', path: '/reports', iconName: 'file' },
  { name: 'settings', path: '/settings', iconName: 'setting' },
];

export const renderNavigationItems = () => {
  const activeStyles = {
    fontWeight: 'bold',
  };
  const renderItem = category => route => {
    const showIcon = route.iconName && route.iconName.length > 0;
    if (route.category !== category.name) {
      return null;
    }

    return (
      <Menu.Item key={route.path}>
        <NavLink activeStyle={activeStyles} to={route.path}>
          {showIcon && <Icon type={route.iconName} />}
          {<IntlMessages id={`route.${route.name}`} />}
        </NavLink>
      </Menu.Item>
    );
  };

  return categories.map(category => (
    <SubMenu
      key={category.name}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Icon type={category.iconName} style={{ fontSize: '1em' }} />
          <IntlMessages id={`navigation.category.${category.name}`} />
        </div>
      }
    >
      {navItems.map(renderItem(category))}
    </SubMenu>
  ));
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
        <RouteNotFound />
      </Switch>
    </div>
  );
};

export default App;
