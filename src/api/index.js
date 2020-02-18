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

export const twoFactorAuth = async (secret, code) =>
  await post('token/obtain/2fa', { secret, ['2fa_code']: code });

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

export const getTransactions = async (account_id, limit) =>
  await get('/transactions', { account_id, limit });

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
export const sendReport = async reportId => await post('/report', { reportId });
export const getReportTypes = async () => await get('/report/types');
export const getReportStatuses = async () => await get('report/statuses');

const fields = [
  {
    type: 'text',
    required: false,
    label: 'Full Name',
    name: 'fullName',
    access: false,
    value: 'John Doe',
    subtype: 'text',
  },
  {
    type: 'date',
    required: true,
    label: 'Birthday',
    className: 'form-control',
    name: 'birthday',
    access: false,
    value: '2020-02-18',
  },
  {
    type: 'radio-group',
    required: false,
    label: 'Gender',
    inline: false,
    name: 'gender',
    access: false,
    other: false,
    values: [
      { label: 'Female', value: 'female' },
      { label: 'Male', value: 'male', selected: true },
      { label: 'Not sure', value: 'notSure' },
    ],
  },
  {
    type: 'number',
    required: false,
    label: 'Phone number',
    name: 'phoneNumber',
    access: false,
    value: '6512312312',
  },
  {
    type: 'select',
    required: false,
    label: 'Country',
    name: 'country',
    access: false,
    multiple: false,
    values: [
      { label: 'Singapore', value: 'sg', selected: true },
      { label: 'Russia', value: 'ru' },
      { label: 'USA', value: 'us' },
    ],
  },
  {
    type: 'file',
    required: false,
    label: 'Upload documents',
    name: 'documents',
    access: false,
    subtype: 'file',
    multiple: false,
  },
  {
    type: 'checkbox-group',
    required: false,
    label: 'Follow us',
    toggle: false,
    inline: false,
    name: 'followUs',
    access: false,
    other: false,
    values: [
      { label: 'Twitter', value: 'twitter', selected: true },
      { label: 'Facebook', value: 'facebook', selected: true },
    ],
  },
];

const docs = [
  {
    id: 1,
    templateId: 1,
    name: 'Document #1',
    status: 'checked',
    fields,
  },
  {
    id: 2,
    templateId: 1,
    name: 'Document #2',
    status: 'in progress',
    fields,
  },
  {
    id: 3,
    templateId: 1,
    name: 'Document #3',
    status: 'new',
  },
];
export const getDocuments = () => docs;
export const getDocument = id =>
  docs.find(({ id: docId }) => Number(docId) === Number(id));
export const getDocumentTemplate = id => ({
  id: 1,
  name: 'Demo doc',
  fields: [
    {
      type: 'date',
      required: true,
      label: 'Birthday',
      className: 'form-control',
      name: 'birthday',
      access: false,
    },
    {
      type: 'checkbox-group',
      required: false,
      label: 'Checkbox Group',
      toggle: false,
      inline: false,
      name: 'checkbox-group-1582010325262',
      access: false,
      other: false,
      values: [{ label: 'Option 1', value: 'option-1', selected: true }],
    },
    {
      type: 'file',
      required: false,
      label: 'File Upload',
      className: 'form-control',
      name: 'file-1582010333095',
      access: false,
      subtype: 'file',
      multiple: false,
    },
    {
      type: 'number',
      required: false,
      label: 'Number',
      className: 'form-control',
      name: 'number-1582010335296',
      access: false,
    },
    {
      type: 'radio-group',
      required: false,
      label: 'Radio Group',
      inline: false,
      name: 'radio-group-1582010345564',
      access: false,
      other: false,
      values: [
        { label: 'Option 1', value: 'option-1', selected: true },
        { label: 'Option 2', value: 'option-2' },
        { label: 'Option 3', value: 'option-3' },
      ],
    },
    {
      type: 'select',
      required: false,
      label: 'Select',
      className: 'form-control',
      name: 'select-1582010354814',
      access: false,
      multiple: false,
      values: [
        { label: 'Option 1', value: 'option-1', selected: true },
        { label: 'Option 2', value: 'option-2' },
        { label: 'Option 3', value: 'option-3' },
      ],
    },
    {
      type: 'text',
      required: false,
      label: 'Text Field',
      className: 'form-control',
      name: 'text-1582010356146',
      access: false,
      subtype: 'text',
    },
  ],
});
