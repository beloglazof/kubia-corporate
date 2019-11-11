import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select
} from 'antd';
import { paymentsPay, usersCheck, withdrawal } from '../../api';
import React from 'react';
import { startCase } from 'lodash/string';
import { useSelector } from 'react-redux';
import getRandomString from '../../util/getRandomString';
import InternalRecipientFields from './InternalRecipientFields';
import RemittanceRecipientFields from './RemittanceRecipientFields';
import PaymentTypeField from './PaymentTypeField';
import AccountField from './AccountField';
import AmountField from './AmountField';
import NoteField from './NoteField';

const FormItem = Form.Item;

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

const PaymentData = ({ form }) => {
  console.log(form)
  const { getFieldsValue } = form;
  const fields = getFieldsValue();
  const renderFields = () => {
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
  return <Descriptions column={1}>{renderFields()}</Descriptions>;
};
const PaymentForm = ({ form, history }) => {
  const accounts = useSelector(state => state.accounts);

  const { getFieldsValue, getFieldValue, validateFields } = form;

  const paymentType = getFieldValue('paymentType');
  const account = getFieldValue('account');
  const balance = account ? account.amount : 0;
  const amount = getFieldValue('amount');

  const sendPaymentRequest = async () => {
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
    } = getFieldsValue();

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
  const handleSubmit = e => {
    e.preventDefault();
    validateFields(errors => {
      if (!errors) {
        Modal.confirm({
          title: 'Is payment data correct?',
          content: <PaymentData form={form} />,
          onOk: sendPaymentRequest,
          onCancel() {},
          centered: true
        });
      }
    });
  };

  const accountFieldProps = {
    accounts,
    form
  };

  const amountFieldProps = {
    balance,
    form
  };

  const formLayoutProps = {
    layout: 'horizontal',

    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 8}
    },
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 }
    }
  };
  
  const submitButtonLayoutProps = {
    wrapperCol: {
      xs: { span: 24, offset: 8 },
      sm: { span: 12 },
      md: { span: 8}
    },
  }

  return (
    <Row>
      <Col span={24}>
        <h2>New Payment</h2>
        <Form onSubmit={handleSubmit} {...formLayoutProps}>
          <PaymentTypeField form={form} />
          {paymentType && <AccountField {...accountFieldProps} />}
          {account && (
            <>
              <AmountField {...amountFieldProps} />
              <NoteField form={form} />
            </>
          )}
          {amount > 0 && renderRecipientFields(paymentType, form)}
          <FormItem {...submitButtonLayoutProps}>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  );
};

export default PaymentForm;
