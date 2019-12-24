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
import PropTypes from 'prop-types';
import { useHistory, useLocation } from 'react-router-dom';















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
      {/* <PaymentType form={form} /> */}
      {paymentType && (
        <>
          {/* <AccountSelect
            form={form}
            accounts={filteredAccounts}
            paymentType={paymentType}
          /> */}
          {paymentType === 'internal' && (
            {/* <LinkedUserSelect form={form} people={people} /> */}
          )}
          {paymentType === 'remittance' && (
            {/* <BeneficiarySelect form={form} beneficiaries={beneficiaries} /> */}
          )}
          {/* <PaymentReference form={form} /> */}

          {paymentType === 'remittance' && (
            {/* <FundingSource form={form} sources={fundingSource} /> */}
          )}
          {/* <AmountField
            form={form}
            balance={balance}
            currency={amountCurrency}
          /> */}
          {paymentType === 'remittance' && (
            <>
              {/* <PaymentPurpose form={form} purposes={purposeOfTransfer} /> */}
              <UploadInvoice form={form} setFileId={setFileId} />
            </>
          )}
          {/* <NoteField form={form} /> */}
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
