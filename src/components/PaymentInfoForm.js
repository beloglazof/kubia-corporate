import { Button, Form, Radio, Input, Upload, Icon } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import InputItem from './BeneficiaryAddForm/InputItem';
import SelectItem from './BeneficiaryAddForm/SelectItem';
import useAsync from '../hooks/useAsync';
import { getBeneficiary, getPeople } from '../api';
import { submitButtonLayoutProps } from '../routes/Pay';

export const PaymentTypeField = ({ form }) => {
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
export const AccountField = ({ accounts, form }) => {
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

export const AmountField = ({ balance, form }) => {
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

export const SelectBeneficiary = ({ form }) => {
  const [beneficiaries] = useAsync(getBeneficiary, []);
  const options = beneficiaries
    .filter(counterparty => counterparty.accountNumber)
    .map(beneficiary => {
      const { nickname, accountNumber, id, companyName } = beneficiary;

      const title = `${nickname || ''} ${companyName || ''} ${accountNumber ||
        ''}`;
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
export const SelectLinkedUser = ({ form }) => {
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

export const PaymentPurpose = ({ form }) => {
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

export const PaymentReference = ({ form }) => {
  return (
    <InputItem
      form={form}
      label="Payment Reference"
      placeholder="For family"
      id="paymentRefrence"
    />
  );
};

export const UploadInvoice = ({ form }) => {
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

export const NoteField = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="Note">
      {getFieldDecorator('note')(<Input allowClear />)}
    </Form.Item>
  );
};

export const PaymentInfoForm = ({
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
          <PaymentReference form={form} />
          <AccountField form={form} accounts={accounts} />
          <AmountField form={form} balance={balance} />
          {paymentType === 'internal' && <SelectLinkedUser form={form} />}
          {paymentType === 'remittance' && <SelectBeneficiary form={form} />}

          <PaymentPurpose form={form} />

          <UploadInvoice form={form} />
          <NoteField form={form} />
          <Form.Item {...submitButtonLayoutProps}>
            <Button type="primary" onClick={handleCreateClick}>
              Create Payment Request
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );
};
