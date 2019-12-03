import { useStepsForm } from '@sunflower-antd/steps-form';
import {
  Button,
  Col,
  Descriptions,
  Form,
  Icon,
  message,
  Row,
  Steps,
  Upload,
  Input,
  Result,
  Radio
} from 'antd';
import { startCase } from 'lodash/string';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchPaymentDetails,
  getBeneficiary,
  paymentsPay,
  usersCheck,
  withdrawal,
  getPeople
} from '../../api';
import useAsync from '../../hooks/useAsync';
import getRandomString from '../../util/getRandomString';
import InputItem from '../BeneficiaryAddForm/InputItem';
import SelectItem from '../BeneficiaryAddForm/SelectItem';
import SearchUserByPhoneWrapper from './SearchUserByPhone';

const FormItem = Form.Item;
const { Step } = Steps;

const sendPaymentRequest = async (values, paymentType, history) => {
  const {
    amount,
    account,
    note,
    phone,
    swift,
    bankCode,
    bankName,
    bankAddress,
    bankBranchCode,
    accountId
  } = values;

  const account_id = account.id;
  const idempotency = getRandomString();
  let params;
  let request;
  if (paymentType === 'internal') {
    const recipientUser = await usersCheck(phone);
    const user_id = recipientUser.id;
    params = {
      amount,
      account_id,
      user_id,
      description: note || '',
      idempotency
    };
    request = paymentsPay;
  }
  if (paymentType === 'remittance') {
    params = {
      amount,
      account_id,
      notes: note || '',
      withdrawal_type: 1,
      idempotency,
      recipient: {
        swift,
        bank_code: bankCode,
        bank_account_id: accountId,
        branch_code: bankBranchCode,
        bank_address: bankAddress,
        bank_name: bankName
      }
    };
    request = withdrawal;
  }

  try {
    const response = await request(params);
    if (response) {
      message.success('We executing your payment request now');
      history.push('/');
    }
  } catch (error) {
    const err = error.response.data.error[0];
    const msg = `${err.message} ${err.code}`;
    message.error(msg);
  }
};

const submitButtonLayoutProps = {
  wrapperCol: {
    xs: { span: 24, offset: 8 },
    sm: { span: 12 },
    md: { span: 8, offset: 6 }
  }
};

const PaymentForm = ({ form, history }) => {
  const [paymentType, setPaymentType] = useState();
  const gotoNextStep = () => gotoStep(current + 1);
  const handleSubmit = async values => {
    sendPaymentRequest(values, paymentType, history);
    gotoNextStep();
  };

  const { current, gotoStep, stepsProps, formProps, submit } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });

  const [paymentDetails, setPaymentDetails] = useState();

  const getDetails = async () => {
    const fetchedDetails = await fetchPaymentDetails();
    if (fetchedDetails) setPaymentDetails(fetchedDetails);
  };

  const formLayoutProps = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 6 },
      md: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 }
    },
    labelAlign: 'right'
  };

  return (
    <Row>
      <Col span={24}>
        <h2 style={{ marginBottom: '2em' }}>New Payment</h2>

        <Steps {...stepsProps}>
          <Step title="Create Payment Request" />
          <Step title="Submit Payment Request" />
          <Step title="Success" />
        </Steps>

        <Form {...formLayoutProps} {...formProps} style={{ marginTop: '2em' }}>
          {current === 0 && (
            <PaymentInfoForm
              form={form}
              setPaymentType={setPaymentType}
              gotoNextStep={gotoNextStep}
              getDetails={getDetails}
            />
          )}
          {current === 1 && (
            <PaymentDetails
              form={form}
              details={paymentDetails}
              gotoNextStep={gotoNextStep}
            />
          )}
        </Form>
        {current === 2 && (
          <Result
            status="success"
            title="Request succefully submitted!"
            extra={
              <>
                <Button type="primary" onClick={() => gotoStep(0)}>
                  Make new payment
                </Button>
                {/* <Button onClick={() => }>
                  Go home
                </Button> */}
              </>
            }
          />
        )}
      </Col>
    </Row>
  );
};

export default PaymentForm;

const PaymentDetails = ({ form, details, gotoNextStep }) => {
  const renderFields = fields => {
    if (!fields) return null;
    return Object.entries(fields).map(field => {
      const [fieldName, fieldValue] = field;
      const name = startCase(fieldName);
      let value;
      switch (fieldName) {
        case 'account':
          value = fieldValue.number;
          break;
        case 'amount':
          value = `S$ ${fieldValue}`;
          break;
        case 'paymentType':
          value = startCase(fieldValue);
          break;
        case 'phone':
          value = `+65 ${fieldValue}`;
          break;
        default:
          value = fieldValue;
          break;
      }
      return (
        <Descriptions.Item label={name} key={name}>
          <span style={{ fontWeight: '500' }}>{value}</span>
        </Descriptions.Item>
      );
    });
  };

  const [submitState, setSubmitState] = useState('pending');
  const handleSubmitClick = async () => {
    // -> request otp
    const OTPRequested = await new Promise(resolve =>
      setTimeout(() => resolve(true), 2000)
    );
    if (OTPRequested) {
      setSubmitState('OTP');
    }
  };

  const [OTP, setOTP] = useState();
  const handleOTPSendClick = async () => {
    // -> send otp and payment id
    const submitted = await new Promise(resolve =>
      setTimeout(() => resolve(true), 2000)
    );
    if (submitted) {
      setSubmitState('submitted');
      gotoNextStep();
    }
  };
  return (
    <>
      <Descriptions bordered column={1}>
        {renderFields(details)}
      </Descriptions>
      {submitState === 'pending' && (
        <Button type="primary" onClick={handleSubmitClick}>
          Submit payment
        </Button>
      )}
      {submitState === 'OTP' && (
        <>
          <Form.Item>
            <Input
              id="otp"
              label="Code"
              placeholder="Code from SMS"
              onChange={e => setOTP(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleOTPSendClick}>
              Send
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );

  // confirm button
  // -> request otp
  // -> otp input
  // -> send otp and payment id
};

const PaymentInfoForm = ({
  form,
  setPaymentType,
  gotoNextStep,
  getDetails
}) => {
  const { getFieldsValue, getFieldValue } = form;
  const accounts = useSelector(state => state.accounts);

  const paymentType = getFieldValue('paymentType');
  if (paymentType) {
    setPaymentType(paymentType);
  }
  const account = getFieldValue('account');
  const balance = account ? account.amount : 0;
  const amount = getFieldValue('amount');
  const recipientField = paymentType === 'internal' ? 'phone' : 'beneficiary';
  const recipient = getFieldValue(recipientField);

  const handleCreateClick = async () => {
    const values = getFieldsValue();
    getDetails(values);
    gotoNextStep();
  };

  return (
    <>
      <PaymentTypeField form={form} />
      {paymentType && (
        <>
          {/* payment reference optional */}
          <PaymentReference form={form} />
          <AccountField form={form} accounts={accounts} />
          <AmountField form={form} balance={balance} />
          {paymentType === 'internal' && <SelectLinkedUser form={form} />}
          {paymentType === 'remittance' && <SelectBeneficiary form={form} />}
          {/* purpose */}
          <PaymentPurpose form={form} />
          {/* invoice file */}
          <UploadInvoice form={form} />
          <NoteField form={form} />
          <FormItem {...submitButtonLayoutProps}>
            <Button type="primary" onClick={handleCreateClick}>
              Create Payment Request
            </Button>
          </FormItem>
        </>
      )}
    </>
  );
};
const PaymentTypeField = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <Form.Item label="Payment Type">
      {getFieldDecorator('paymentType', {
        rules: [{ required: true, message: 'Please choose payment type!' }]
      })(
        <Radio.Group>
          <Radio.Button value="internal">Internal</Radio.Button>
          <Radio.Button value="remittance">Remittance</Radio.Button>
        </Radio.Group>
      )}
    </Form.Item>
  );
};

const accountToOption = account => {
  const { number, amount } = account;
  const title = `${number} | Balance: S$ ${amount}`;
  return {
    title,
    value: account
  };
};
const AccountField = ({ accounts, form }) => {
  const options = accounts.map(accountToOption);
  return (
    <SelectItem
      form={form}
      options={options}
      id="account"
      label="Account"
      placeholder="Select account"
      required
    />
  );
};

const AmountField = ({ balance, form }) => {
  const { getFieldDecorator } = form;
  const greaterThanZero = (rule, value, callback) => {
    if (value > 0) {
      return callback();
    }
    callback('Amount must be greater than zero');
  };
  const lessOrEqualBalance = (rule, value, callback) => {
    if (value > balance) {
      return callback("Amount can't be more than balance");
    }
    callback();
  };

  return (
    <Form.Item label="Amount" hasFeedback>
      {getFieldDecorator('amount', {
        rules: [
          { required: true, message: 'Please enter amount!' },
          { validator: greaterThanZero },
          { validator: lessOrEqualBalance }
        ]
      })(<Input pattern="[0-9]*" inputMode="numeric" addonBefore={'S$'} />)}
    </Form.Item>
  );
};

const SelectBeneficiary = ({ form }) => {
  const [beneficiaries] = useAsync(getBeneficiary, []);
  const options = beneficiaries
    .filter(counterparty => counterparty.accountNumber)
    .map(beneficiary => {
      const { nickname, accountNumber, id, companyName } = beneficiary;

      const title = `${nickname || ''} ${companyName || ''} ${accountNumber || ''}`;
      const option = {
        value: id,
        title
      };

      return option;
    });

  return (
    <SelectItem
      form={form}
      label="Beneficiary"
      id="beneficiary"
      placeholder="Select beneficiary"
      options={options}
      required
    />
  );
};
const SelectLinkedUser = ({ form }) => {
  const [people] = useAsync(getPeople, []);
  const options = people.map(user => {
    const { id, name } = user;

    const option = {
      value: id,
      title: name
    };

    return option;
  });

  return (
    <SelectItem
      form={form}
      label="Linked people"
      id="linkedPeople"
      placeholder="Select user"
      options={options}
      required
    />
  );
};

const PaymentPurpose = ({ form }) => {
  const options = [];
  return (
    <SelectItem
      form={form}
      options={options}
      label="Payment Purpose"
      id="paymentPurpose"
    />
  );
};

const PaymentReference = ({ form }) => {
  return (
    <InputItem
      form={form}
      label="Payment Reference"
      placeholder="For family"
      id="paymentRefrence"
    />
  );
};

const UploadInvoice = ({ form }) => {
  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  return (
    <Form.Item label="Upload Invoice">
      {form.getFieldDecorator('invoice', {
        valuePropName: 'fileList',
        getValueFromEvent: normFile,
        rules: [{ required: false, message: 'Please upload invoice' }]
      })(
        <Upload.Dragger name="files" action="/upload.do">
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload.
          </p>
        </Upload.Dragger>
      )}
    </Form.Item>
  );
};

const NoteField = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="Note">
      {getFieldDecorator('note')(<Input allowClear />)}
    </Form.Item>
  );
};
