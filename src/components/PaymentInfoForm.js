import { Button, Form, Radio, Input, Upload, Icon, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InputItem from './InputItem';
import SelectItem from './SelectItem';
import useAsync from '../hooks/useAsync';
import {
  getBeneficiary,
  getPeople,
  getWallexInfo,
  uploadInvoice,
} from '../api';
import { submitButtonLayoutProps } from '../routes/Pay';
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';

const PaymentTypeField = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <Form.Item label="Payment Type">
      {getFieldDecorator('paymentType', {
        initialValue: 'internal',
        rules: [{ required: true, message: 'Please choose payment type!' }],
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
  form: PropTypes.object.isRequired,
};

const AccountField = ({ accounts, form }) => {
  let location = useLocation();
  const fromAccountId = location.state?.accountId;
  const options = accounts.map(account => {
    const { number, amount } = account;
    const title = `${number} | Balance: S$ ${amount}`;
    return {
      title,
      value: account.id,
    };
  });
  const selectProps = {
    placeholder: 'Select account',
  };
  return (
    <SelectItem
      form={form}
      label="Account"
      id="account"
      options={options}
      required
      selectProps={selectProps}
      initialValue={fromAccountId}
    />
  );
};

AccountField.propType = {
  accounts: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
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
          { validator: lessOrEqualBalance },
        ],
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
  form: PropTypes.object.isRequired,
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
        title,
      };

      return option;
    });
  let history = useHistory();
  const dropdownRender = menu => (
    <div>
      <div
        className="hoverable"
        style={{
          padding: '4px 8px 6px',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(224, 224, 224, 0.25)',
        }}
        onMouseDown={e => e.preventDefault()}
        onClick={() => history.push('/beneficiaries/add')}
      >
        <Icon type="plus" /> Add beneficiary
      </div>
      {menu}
    </div>
  );

  const selectProps = {
    placeholder: 'Select beneficiary',
    dropdownRender,
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
  form: PropTypes.object.isRequired,
};

const SelectLinkedUser = ({ form, people }) => {
  const options = people.map(user => {
    const { id, name } = user;

    const option = {
      value: id,
      title: name,
    };

    return option;
  });

  const selectProps = {
    placeholder: 'Select user',
  };

  return (
    <SelectItem
      form={form}
      label="Linked user"
      id="linkedUser"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

SelectLinkedUser.propTypes = {
  form: PropTypes.object.isRequired,
};

const PaymentPurpose = ({ form, purposes = [] }) => {
  const options = purposes.map(purpose => ({
    value: purpose.name,
    title: purpose.description,
  }));
  const purpose = form.getFieldValue('purposeOfTransfer');
  const showDescriptionField = purpose && purpose.toLowerCase() === 'oth';
  return (
    <>
      <SelectItem
        form={form}
        label="Payment Purpose"
        id="purposeOfTransfer"
        placeholder="Select purpose"
        options={options}
        required
      />
      {showDescriptionField && (
        <InputItem
          form={form}
          label="Purpose Description"
          id="purposeOfTransferDescription"
          placeholder="Input description"
          required
        />
      )}
    </>
  );
};

PaymentPurpose.propTypes = {
  form: PropTypes.object.isRequired,
  purposes: PropTypes.array.isRequired,
};

const FundingSource = ({ form, sources = [] }) => {
  const options = sources.map(purpose => ({
    value: purpose.name,
    title: purpose.description,
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
  sources: PropTypes.array.isRequired,
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
  form: PropTypes.object.isRequired,
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
        rules: [{ required: true, message: 'Please upload invoice' }],
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
  form: PropTypes.object.isRequired,
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
  form: PropTypes.object.isRequired,
};

const PaymentInfoForm = ({
  form,
  getDetails,
  sendInternalRequest,
  setPaymentType,
  setFileId,
  submitButtonLayoutProps,
}) => {
  const { getFieldsValue, getFieldValue } = form;

  const accounts = useSelector(state => state.accounts);
  const paymentType = getFieldValue('paymentType');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  useEffect(() => {
    if (paymentType) {
      setPaymentType(paymentType);
      if (paymentType === 'internal') {
        const filtered = accounts.filter(
          acc => acc.currency_info.code === 'SGD'
        );
        setFilteredAccounts(filtered);
      }
    }
  }, [paymentType]);
  const accountId = getFieldValue('account');
  const account = accounts.find(a => a.id === accountId);
  const balance = account ? account.amount : 0;

  const [people] = useAsync(getPeople, []);

  const [loading, setLoading] = useState(false);
  const handleCreateClick = () => {
    form.validateFields(async (errors, values) => {
      setLoading(true);
      if (errors) return;
      if (paymentType === 'internal') {
        const { amount, account, linkedUser, note } = values;
        const user = people.find(u => u.id === linkedUser);
        const userId = user.id;
        await sendInternalRequest(amount, account, userId, note);
      } else if (paymentType === 'remittance') {
        await getDetails(values);
      } else {
        console.error('Unknown payment type');
      }
      setLoading(false);
    });
  };

  const [beneficiaries] = useAsync(getBeneficiary, []);
  const beneficiaryId = form.getFieldValue('beneficiary');
  const selectedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
  const beneficiaryCurrency = selectedBeneficiary?.bankAccount?.currency;

  const amountCurrency =
    paymentType === 'remittance' ? beneficiaryCurrency : 'SGD';

  const [wallexInfo] = useAsync(getWallexInfo, {});
  const { fundingSource, purposeOfTransfer } = wallexInfo;
  return (
    <>
      <PaymentTypeField form={form} />
      {paymentType && (
        <>
          <AccountField
            form={form}
            accounts={filteredAccounts}
            paymentType={paymentType}
          />
          {paymentType === 'internal' && (
            <SelectLinkedUser form={form} people={people} />
          )}
          {paymentType === 'remittance' && (
            <SelectBeneficiary form={form} beneficiaries={beneficiaries} />
          )}
          {/* <PaymentReference form={form} /> */}

          {paymentType === 'remittance' && (
            <FundingSource form={form} sources={fundingSource} />
          )}
          <AmountField
            form={form}
            balance={balance}
            currency={amountCurrency}
          />
          {paymentType === 'remittance' && (
            <>
              <PaymentPurpose form={form} purposes={purposeOfTransfer} />
              <UploadInvoice form={form} setFileId={setFileId} />
            </>
          )}
          <NoteField form={form} />
          <Form.Item style={{ padding: '0 16px' }} {...submitButtonLayoutProps}>
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
  getDetails: PropTypes.func.isRequired,
};

export default PaymentInfoForm;
