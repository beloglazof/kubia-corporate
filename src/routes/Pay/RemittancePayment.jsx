import React, { useState } from 'react';
import {
  BeneficiarySelect,
  AccountSelect,
  FundingSourceSelect,
  AmountInput,
  PaymentPurposeSelect,
  NoteFieldInput,
} from '../../components/PaymentFields';
import { useSelector } from 'react-redux';
import useAsync from '../../hooks/useAsync';
import {
  getBeneficiary,
  getWallexInfo,
  uploadInvoice,
  fetchPaymentDetails,
  getCompanies,
} from '../../api';
import { Form, Upload, Icon, Button, Row, Col, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import TopTitle from '../../components/TopTitle';

const UploadInvoice = ({ form, setFileId }) => {
  const normFile = e => {
    // console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const upload = async ({ file, onProgress, onError, onSuccess }) => {
    // console.log(file);
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

const formLayoutProps = {
  // labelCol: {
  //   xs: { span: 8 },
  //   sm: { span: 8 },
  //   md: { span: 6 },
  //   lg: { span: 4 },
  // },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 14 },
    xl: { span: 12 },
  },
  labelAlign: 'left',
  layout: 'vertical',
};

const RemittancePaymentForm = ({
  form,
  onSubmit,
  accounts,
  beneficiaries,
  setFileId,
}) => {
  const paymentType = 'remittance';
  const { getFieldValue, validateFields } = form;

  const accountId = getFieldValue('accountId');
  const account = accounts.find(a => a.id === accountId);
  const balance = account ? account.amount : 0;

  const [loading, setLoading] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (errors, values) => {
      setLoading(true);
      if (errors) {
        setLoading(false);
        return;
      }
      await onSubmit(values);
      setLoading(false);
    });
  };

  const beneficiaryId = getFieldValue('beneficiaryId');
  const selectedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
  const beneficiaryCurrency = selectedBeneficiary?.bankAccount?.currency;
  const amountCurrency = beneficiaryCurrency;

  const [wallexInfo] = useAsync(getWallexInfo, {});
  const { fundingSource, purposeOfTransfer } = wallexInfo;

  return (
    <Form {...formLayoutProps} onSubmit={handleSubmit} hideRequiredMark>
      <AccountSelect
        form={form}
        accounts={accounts}
        paymentType={paymentType}
      />
      <BeneficiarySelect form={form} beneficiaries={beneficiaries} />
      <FundingSourceSelect form={form} sources={fundingSource} />
      <AmountInput form={form} balance={balance} currency={amountCurrency} />
      <PaymentPurposeSelect form={form} purposes={purposeOfTransfer} />
      <UploadInvoice form={form} setFileId={setFileId} />

      <NoteFieldInput form={form} />
      <Form.Item style={{ padding: '0 16px' }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create payment request
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedRequestForm = Form.create()(RemittancePaymentForm);

const RemittancePayment = () => {
  const [fileId, setFileId] = useState();
  const [inputedData, setInputedData] = useState();
  const accounts = useSelector(state => state.accounts);
  const [beneficiaries] = useAsync(getBeneficiary, []);
  let history = useHistory();

  const getDetails = async fieldValues => {
    setInputedData(fieldValues);
    const {
      amount,
      beneficiaryId: beneficiary_id,
      accountId: account_id,
    } = fieldValues;

    //TODO extract companies into redux
    const companies = await getCompanies();
    const company_id = companies[0].id;

    const account = accounts.find(acc => acc.id === account_id);
    const sellCurrency = account.currency_info.code;

    const beneficiary = beneficiaries.find(b => b.id === beneficiary_id);
    const buyCurrency = beneficiary.bankAccount.currency;

    const params = {
      file_id: [fileId],
      amount,
      beneficiary_id,
      account_id,
      company_id,
      buyCurrency,
      sellCurrency,
      fixedSide: 'buy',
    };
    const fetchedDetails = await fetchPaymentDetails(params);

    if (fetchedDetails) {
      const {
        request: { quoteId },
      } = fetchedDetails;
      const { purposeOfTransfer, fundingSource } = fieldValues;

      localStorage.setItem(
        quoteId,
        JSON.stringify({
          purposeOfTransfer,
          fundingSource,
          paymentDetails: fetchedDetails,
          submitState: 'pending'
        })
      );
      history.push(`/payments/remittance/requests/${quoteId}`);
    }
  };

  return (
    <>
      <TopTitle title="Remittance payment request" />

      <WrappedRequestForm
        accounts={accounts}
        onSubmit={getDetails}
        setFileId={setFileId}
        accounts={accounts}
        beneficiaries={beneficiaries}
      />
    </>
  );
};

export default RemittancePayment;
