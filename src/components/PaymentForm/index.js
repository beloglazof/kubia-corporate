import { Button, Col, Descriptions, Form, message, Row, Steps } from 'antd';
import {
  fetchPaymentQuotesMock,
  paymentsPay,
  usersCheck,
  withdrawal
} from '../../api';
import React, { useState } from 'react';
import { startCase } from 'lodash/string';
import { useSelector } from 'react-redux';
import getRandomString from '../../util/getRandomString';
import InternalRecipientFields from './InternalRecipientFields';
import RemittanceRecipientFields from './RemittanceRecipientFields';
import PaymentTypeField from './PaymentTypeField';
import AccountField from './AccountField';
import AmountField from './AmountField';
import NoteField from './NoteField';
import { useStepsForm } from '@sunflower-antd/steps-form';

const FormItem = Form.Item;
const { Step } = Steps;

const renderRecipientFields = (paymentType, form) => {
  switch (paymentType) {
    case 'internal':
      return <InternalRecipientFields form={form} />;
    case 'remittance':
      return <RemittanceRecipientFields form={form} />;
    default:
      return null;
  }
};

const PaymentDetails = ({ details }) => {
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
  return <Descriptions column={1}>{renderFields(details)}</Descriptions>;

  // confirm button
  // -> request otp
  // -> otp input
  // -> send otp and payment id
};

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
      description: note ? note : '',
      idempotency
    };
    request = paymentsPay;
  }
  if (paymentType === 'remittance') {
    params = {
      amount,
      account_id,
      notes: note ? note : '',
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

const PaymentInfoForm = ({ form, setPaymentType, gotoStep, getQuotes }) => {
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

  const handleGetQuotes = async () => {
    const values = getFieldsValue();
    //send values for getting quote info
    getQuotes(values);
    // console.log(values);
    gotoStep(1);
  };

  return (
    <>
      <PaymentTypeField form={form} />
      {/* payment reference optional */}
      {paymentType && <AccountField form={form} accounts={accounts} />}
      {account && <AmountField form={form} balance={balance} />}
      {amount > 0 &&
        amount <= balance &&
        renderRecipientFields(paymentType, form)}
      {/* purpose */}
      {/* invoice file */}
      {recipient && (
        <>
          <NoteField form={form} />
          <FormItem {...submitButtonLayoutProps}>
            <Button type="primary" onClick={handleGetQuotes}>
              Create Payment Request
            </Button>
          </FormItem>
        </>
      )}
    </>
  );
};

const PaymentForm = ({ form, history }) => {
  const [paymentType, setPaymentType] = useState();
  const handleSubmit = async values => {
    sendPaymentRequest(values, paymentType, history);
    gotoStep(current + 1);
  };

  const { current, gotoStep, stepsProps, formProps, submit } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });

  const [paymentQuotes, setPaymentQuotes] = useState();

  const getQuotes = async values => {
    // await get quotes request
    const fetchedQuotes = await fetchPaymentQuotesMock();
    console.log(fetchedQuotes);
    if (fetchedQuotes) setPaymentQuotes(fetchedQuotes);
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
    labelAlign: 'left'
  };

  return (
    <Row>
      <Col span={24}>
        <h2>New Payment</h2>

        <Steps {...stepsProps}>
          <Step title="Payment Info" />
          <Step title="Payment Details" />
          <Step title="Payment " />
        </Steps>

        <Form {...formLayoutProps} {...formProps}>
          {current === 0 && (
            <PaymentInfoForm
              form={form}
              setPaymentType={setPaymentType}
              gotoStep={gotoStep}
              getQuotes={getQuotes}
            />
          )}
          {current === 1 && (
            <PaymentDetails form={form} quotes={paymentQuotes} />
          )}
        </Form>

        {current === 1 && (
          <Button type="primary" htmlType="submit" onClick={() => submit()}>
            Submit
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default PaymentForm;
