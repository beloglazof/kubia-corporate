import { get, post } from './config';

export const usersCheck = async phone => await get('users/check', { phone });

export const usersMe = async () => await get('users/me');

export const tokenObtain = async () => await post('token/obtain');

export const paymentsPay = async (
  params = { amount: '', account_id: '', user_id: '', idempotency: '' }
) => await post('payments/pay', params);

export const withdrawal = async (
  params = {
    account_id: 0,
    amount: 0,
    notes: '',
    withdrawal_type: 1,
    recepient: {
      swift: '',
      bank_code: '',
      bank_account_id: '',
      branch_code: '',
      bank_address: '',
      bank_name: ''
    },
    idempotency: ''
  }
) => await post('withdrawal', params);

export const getSessions = async () => await get('sessions');

export const cardsNew = async (
  params = {
    account_id: 0,
    type_id: 0,
    assoc_number: '',
    failed_id: 0,
    pin: ''
  }
) => await post('/cards/new', params);
