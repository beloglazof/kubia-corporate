import { get, httpDelete, patch, post } from './config';
export const getDesktopMainScreen = async () =>
  await get('compose/desktop-main-screen');
export const usersCheck = async (phone, notifyError) =>
  await get('users/check', { phone }, notifyError);

export const usersMe = async () => await get('users/me');

export const tokenObtain = async (params = { phone: '', password: '' }) =>
  await post('token/obtain', params);

export const tokenRefresh = async (params = { refreshToken: '' }) =>
  await post('token/refresh', params);

export const logout = async () => await get('logout');

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
export const killSession = async id => await patch('sessions', { id });

//cards

export const getCards = async () => await get('/cards/active');

export const patchCardsOTP = async (params = { request_id: 0, otp: '' }) =>
  await patch('/cards/otp', params);

export const getNewOTP = async (params = { request_id: 0 }) =>
  await post('/cards/otp', params);

export const cardsNew = async (
  params = {
    account_id: 0,
    type_id: 0,
    assoc_number: '',
    failed_id: 0,
    pin: ''
  }
) => await post('/cards/new', params);

export const getCardsNew = async request_id =>
  await get('/cards/new', { request_id });

export const cardsRequestState = async () =>
  await get('/cards/request_states', {});

export const getTransactions = async () => await get('/transactions');

export const getBeneficiary = async id => {
  const fetched = await get('/beneficiary', { id });
  if (fetched) {
    const filtered = fetched.filter(counterparty => counterparty.bankAccount);
    return filtered;
  } else {
    return [];
  }
};
export const getBeneficiaryFields = async (
  currency,
  bank_account_country,
  beneficiary_country
) =>
  await get('/beneficiary/fields', {
    currency,
    bank_account_country,
    beneficiary_country
  });
export const createBeneficiary = async json => await post('/beneficiary', json);

export const updateBeneficiary = async (id, updatedFields) =>
  await patch(`/beneficiary/${id}`, updatedFields);

export const deleteBeneficiary = async id =>
  await httpDelete(`/beneficiary/${id}`);

export const getCountries = async () => await get('/countries');

export const getCurrencies = async () => await get('/currencies');

export const fetchPaymentDetails = async () =>
  await new Promise(resolve =>
    setTimeout(() =>
      resolve(
        {
          deliveryDate: '2018-09-27',
          buyCurrency: 'IDR',
          sellCurrency: 'SGD',
          buyAmount: 1000,
          sellAmount: 0.1,
          rate: 10898,
          feeRate: 0,
          totalAmount: 0.1,
          quoteId: '5595393c-9294-4a60-a1e7-97fb4981b9a3',
          conversionDate: '2018-09-27',
          conversionFee: 0,
          paymentFee: 0,
          totalFee: 0,
          conversionFeeRate: 0,
          paymentFeeRate: 0,
          totalFeeRate: 0,
          expiresAt: '2018-09-27T00:35:45Z'
        },
        1000
      )
    )
  );

export const getCompanyFields = async () => await get('/company/fields');
export const getCompanies = async () => await get('/company');
export const getCompany = async id => await get('/company', { id });

export const getPeople = async id => await get('/people', { id });
export const addPeople = async people => await post('/people', people)
export const deletePeople = async id => await httpDelete('/people', {id})
