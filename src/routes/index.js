import Transactions from '../components/Transactions';
import Accounts from './Accounts';
import Settings from './Settings';
import Beneficiaries from './Beneficiaries';
import BeneficiaryAddForm from '../components/BeneficiaryAddForm';
import LinkedPeople from './LinkedPeople';
import PayPage from './Pay';
import InternalPayment from './Pay/InternalPayment';
import RemittancePayment from './Pay/RemittancePayment';
import Reports from './Reports';
import Profile from './Profile';
import Documents from './Documents';

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
    name: 'internal payment',
    path: '/payments/new/internal',
    component: InternalPayment,
    exact: true,
  },
  {
    name: 'remittance payment',
    path: '/payments/new/remittance',
    component: RemittancePayment,
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
    name: 'beneficiaries',
    path: '/beneficiaries/add',
    component: BeneficiaryAddForm,
    exact: true,
  },
  {
    name: 'linkedPeople',
    path: '/linked-people',
    component: LinkedPeople,
    exact: true,
  },
  {
    name: 'reports',
    path: '/reports',
    component: Reports,
    exact: true,
  },
  {
    name: 'settings',
    path: '/settings',
    component: Settings,
    exact: true,
  },
  {
    name: 'profile',
    path: '/profile',
    component: Profile,
    exact: true,
  },
  {
    name: 'documents',
    path: '/documents',
    component: Documents,
    exact: true,
  },
];
