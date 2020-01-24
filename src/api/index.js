import { get, httpDelete, patch, post, postFile } from './config';
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

export const paymentsPay = async (amount, account_id, user_id, idempotency) =>
  await post('payments/pay', { amount, account_id, user_id, idempotency });

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
      bank_name: '',
    },
    idempotency: '',
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
    pin: '',
  }
) => await post('/cards/new', params);

export const getCardsNew = async request_id =>
  await get('/cards/new', { request_id });

export const cardsRequestState = async () =>
  await get('/cards/request_states', {});

export const getTransactions = async account_id =>
  await get('/transactions', { account_id });

export const getBeneficiary = async id => {
  const fetched = await get('/beneficiary', { id });
  if (fetched) {
    const filtered = fetched.filter(
      counterparty => counterparty?.bankAccount?.currency
    );
    return filtered;
  } else {
    return [];
  }
};

export const getBeneficiaryFieldsOld = async (
  currency,
  bank_account_country,
  beneficiary_country
) => {
  const response = await get('/beneficiary/fields', {
    currency,
    bank_account_country,
    beneficiary_country,
  });
  return response[0].data;
};

export const getBeneficiaryFields = async (
  currency,
  bankAccountCountry,
  beneficiaryCountry
) =>
  await post('/remittance/requirements/wallex', {
    currency,
    bankAccountCountry,
    beneficiaryCountry,
  });
export const createBeneficiary = async json => await post('/beneficiary', json);

export const updateBeneficiary = async (id, updatedFields) =>
  await patch(`/beneficiary/${id}`, updatedFields);

export const deleteBeneficiary = async id =>
  await httpDelete(`/beneficiary/${id}`);

export const getCountries = async () => await get('/countries');

export const getCurrencies = async () => await get('/currencies');
export const getBeneficiaryCurrencies = async () =>
  await get('remittance/currencies/wallex');
export const fetchPaymentDetails = async (
  params = {
    company_id: 0,
    beneficiary_id: 0,
    account_id: 0,
    buyCurrency: 'SGD',
    sellCurrency: 'SGD',
    amount: 0,
  }
) => await post('remittance/request/wallex', params);
export const getWallexInfo = async () =>
  await get('remittance/request/wallex/info');
export const uploadInvoice = async invoice =>
  await postFile('remittance/upload/wallex', invoice);
export const submitRemittance = async (
  params = {
    quote_id: '',
    fundingSource: '',
    paymentReference: '',
    purposeOfTransfer: '',
    purposeOfTransferDescription: '',
  }
) => await post('/remittance/wallex', params);
export const getWallexOTP = async quote_id =>
  await post('remittance/otp/wallex', { quote_id });
export const getConvertionRate = async (
  buyCurrency,
  sellCurrency,
  fixedSide,
  amount = 1
) =>
  await post('/remittance/convertion/wallex', {
    buyCurrency,
    sellCurrency,
    fixedSide,
    amount,
  });

export const getCompanyFields = async () => await get('/company/fields');
export const getCompanies = async () => await get('/company');
export const getCompany = async id => await get('/company', { id });

export const getPeople = async id => await get('/people', { id });
export const addPeople = async people => await post('/people', people);
export const deletePeople = async id => await httpDelete('/people', { id });

export const getAccounts = async () => await get('/accounts');

export const getReports = async () => await get('/report');
export const createReport = async (type, period_start, period_end, email) =>
  await post('/report', { type, period_start, period_end, email });
export const sendReport = async (reportId) =>
  await post('/report', { reportId });
export const getReportTypes = async () => await get('/report/types');
export const getReportStatuses = async () => await get('report/statuses');