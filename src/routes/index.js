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
import Profile from './Profile';

export default [
  {
    name: 'accounts',
    path: '/accounts',
    component: Accounts,
    exact: true,
  },
  {
    name: 'pay',
    path: '/payments/new',
    component: PayPage,
    exact: true,
  },
  {
    name: 'transactions',
    path: '/transactions',
    component: Transactions,
    exact: true,
  },
  {
    name: 'beneficiaries',
    path: '/beneficiaries',
    component: Beneficiaries,
    exact: true,
  },
  {
    name: 'linkedPeople',
    path: '/linked-people',
    component: LinkedPeople,
    exact: true,
  },
  { name: 'reports', path: '/reports', component: Reports, exact: true },
  { name: 'settings', path: '/settings', component: Settings, exact: true },
  { name: 'profile', path: '/profile', component: Profile, exact: true },
];
