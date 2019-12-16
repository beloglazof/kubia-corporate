import { Button, Form, Radio, Input, Upload, Icon } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InputItem from './InputItem';
import SelectItem from './SelectItem';
import useAsync from '../hooks/useAsync';
import {
  getBeneficiary,
  getPeople,
  getWallexInfo,
  uploadInvoice
} from '../api';
import { submitButtonLayoutProps } from '../routes/Pay';
import PropTypes from 'prop-types';

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

PaymentTypeField.propTypes = {
  form: PropTypes.object.isRequired
};

const accountToOption = account => {
  const { number, amount } = account;
  const title = `${number} | Balance: S$ ${amount}`;
  return {
    title,
    value: account.id
  };
};
const AccountField = ({ accounts, form }) => {
  const options = accounts.map(accountToOption);
  const selectProps = {
    placeholder: 'Select account'
  };
  return (
    <SelectItem
      form={form}
      label="Account"
      id="account"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

AccountField.propType = {
  accounts: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired
};

const AmountField = ({ balance, form, currency }) => {
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
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (balance) {
      setDisabled(false);
    }
  }, [balance]);
  return (
    <Form.Item label="Amount">
      {getFieldDecorator('amount', {
        rules: [
          { required: true, message: 'Please enter amount!' },
          { validator: greaterThanZero },
          { validator: lessOrEqualBalance }
        ]
      })(
        <Input
          pattern="[0-9]*"
          inputMode="numeric"
          addonBefore={currency}
          disabled={disabled}
        />
      )}
    </Form.Item>
  );
};

AmountField.propType = {
  balance: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired
};

const SelectBeneficiary = ({ form, beneficiaries }) => {
  const options = beneficiaries
    .filter(counterparty => counterparty.bankAccount)
    .map(beneficiary => {
      const { nickname, bankAccount, id, companyName } = beneficiary;

      const title = `${nickname || ''} ${companyName ||
        ''} ${bankAccount.accountNumber || ''}`;
      const option = {
        value: id,
        title
      };

      return option;
    });

  const selectProps = {
    placeholder: 'Select beneficiary'
  };

  return (
    <SelectItem
      form={form}
      label="Beneficiary"
      id="beneficiary"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

SelectBeneficiary.propTypes = {
  form: PropTypes.object.isRequired
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

  const selectProps = {
    placeholder: 'Select user'
  };

  return (
    <SelectItem
      form={form}
      label="Linked people"
      id="linkedPeople"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

SelectLinkedUser.propTypes = {
  form: PropTypes.object.isRequired
};

const PaymentPurpose = ({ form, purposes = [] }) => {
  const options = purposes.map(purpose => ({
    value: purpose.name,
    title: purpose.description
  }));
  return (
    <SelectItem
      form={form}
      label="Payment Purpose"
      id="purposeOfTransfer"
      placeholder="Select purpose"
      options={options}
      required
    />
  );
};

PaymentPurpose.propTypes = {
  form: PropTypes.object.isRequired,
  purposes: PropTypes.array.isRequired
};

const FundingSource = ({ form, sources = [] }) => {
  const options = sources.map(purpose => ({
    value: purpose.name,
    title: purpose.description
  }));
  return (
    <SelectItem
      form={form}
      label="Funding source"
      id="fundingSource"
      placeholder="Select funding source"
      options={options}
      required
    />
  );
};

FundingSource.propTypes = {
  form: PropTypes.object.isRequired,
  sources: PropTypes.array.isRequired
};

const PaymentReference = ({ form }) => (
  <InputItem
    form={form}
    id="paymentRefrence"
    label="Payment Reference"
    placeholder="For family"
  />
);

PaymentReference.propTypes = {
  form: PropTypes.object.isRequired
};

const UploadInvoice = ({ form, setFileId }) => {
  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const upload = async ({ file, onProgress, onError, onSuccess }) => {
    console.log(file);
    const uploaded = await uploadInvoice(file);
    if (uploaded) {
      const { file_id } = uploaded;
      setFileId(file_id);
      onSuccess();
    } else {
      onError();
    }
  };
  return (
    <Form.Item label="Upload Invoice">
      {form.getFieldDecorator('invoice', {
        valuePropName: 'fileList',
        getValueFromEvent: normFile,
        rules: [{ required: true, message: 'Please upload invoice' }]
      })(
        <Upload.Dragger name="files" customRequest={upload}>
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

UploadInvoice.propTypes = {
  form: PropTypes.object.isRequired
};

const NoteField = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="Note">
      {getFieldDecorator('note')(<Input allowClear />)}
    </Form.Item>
  );
};

NoteField.propTypes = {
  form: PropTypes.object.isRequired
};

const PaymentInfoForm = ({
  form,
  setPaymentType,
  getDetails,
  setFileId,
  submitButtonLayoutProps
}) => {
  const { getFieldsValue, getFieldValue } = form;
  const [wallexInfo] = useAsync(getWallexInfo, {});
  const { fundingSource, purposeOfTransfer } = wallexInfo;
  const accounts = useSelector(state => state.accounts);
  const paymentType = getFieldValue('paymentType');
  if (paymentType) {
    setPaymentType(paymentType);
  }
  const accountId = getFieldValue('account');
  const account = accounts.find(a => a.id === accountId);
  const balance = account ? account.amount : 0;

  const [loading, setLoading] = useState(false);
  const handleCreateClick = async () => {
    setLoading(true);
    const values = getFieldsValue();
    const success = await getDetails(values);
    if (!success) {
      setLoading(false);
    }
  };

  const [beneficiaries] = useAsync(getBeneficiary, []);
  const beneficiaryId = form.getFieldValue('beneficiary');
  const selectedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
  const beneficiaryCurrency = selectedBeneficiary?.bankAccount?.currency;

  return (
    <>
      <PaymentTypeField form={form} />
      {paymentType && (
        <>
          {paymentType === 'internal' && <SelectLinkedUser form={form} />}
          {paymentType === 'remittance' && (
            <SelectBeneficiary form={form} beneficiaries={beneficiaries} />
          )}
          {/* <PaymentReference form={form} /> */}
          <AccountField form={form} accounts={accounts} />
          <FundingSource form={form} sources={fundingSource} />
          <AmountField
            form={form}
            balance={balance}
            currency={beneficiaryCurrency}
          />
          <PaymentPurpose form={form} purposes={purposeOfTransfer} />
          <UploadInvoice form={form} setFileId={setFileId} />
          <NoteField form={form} />
          <Form.Item {...submitButtonLayoutProps}>
            <Button
              type="primary"
              onClick={handleCreateClick}
              loading={loading}
            >
              Create Payment Request
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );
};

PaymentInfoForm.propTypes = {
  form: PropTypes.object.isRequired,
  setPaymentType: PropTypes.func.isRequired,
  getDetails: PropTypes.func.isRequired
};

export default PaymentInfoForm;
