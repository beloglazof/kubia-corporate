import React, { useState, useEffect } from 'react';
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
  getConvertionRate,
} from '../../api';
import {
  Form,
  Upload,
  Icon,
  Button,
  Row,
  Col,
  Typography,
  Tooltip,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import TopTitle from '../../components/TopTitle';
import InputItem from '../../components/InputItem';

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
    span: 24,
    // xs: { span: 24 },
    // sm: { span: 16 },
    // md: { span: 16 },
    // lg: { span: 14 },
    // xl: { span: 12 },
  },
  labelAlign: 'left',
  layout: 'vertical',
};

const RemittancePaymentForm = ({
  form,
  getDetails,
  accounts,
  beneficiaries,
  setFileId,
}) => {
  const paymentType = 'remittance';
  const { getFieldValue, validateFields, setFieldsValue } = form;

  const accountId = getFieldValue('accountId');
  const account = accounts.find(a => a.id === accountId);
  const sellCurrency = account?.currency_info?.code;
  const balance = account ? account.amount : 0;

  useEffect(() => {
    setConvertionRate(null);
  }, [accountId]);

  const beneficiaryId = getFieldValue('beneficiaryId');
  const selectedBeneficiary = beneficiaries.find(b => b.id === beneficiaryId);
  const beneficiaryCurrency = selectedBeneficiary?.bankAccount?.currency;
  const buyCurrency = beneficiaryCurrency;
  const amountCurrency = beneficiaryCurrency;

  const [convertionRate, setConvertionRate] = useState();
  const [showConvertion, setShowConvertion] = useState(false);

  useEffect(() => {
    if (!sellCurrency || !buyCurrency) {
      return;
    }
    if (sellCurrency !== buyCurrency) {
      const fetchRate = async () => {
        const fetchedData = await getConvertionRate(
          buyCurrency,
          sellCurrency,
          'buy'
        );
        if (fetchedData) {
          const { sellAmount: rate } = fetchedData;
          setConvertionRate(rate);
        }
      };

      setShowConvertion(true);
      fetchRate();
    } else {
      setShowConvertion(false);
    }
  }, [sellCurrency, buyCurrency]);

  const [wallexInfo] = useAsync(getWallexInfo, {});
  const { fundingSource = [], purposeOfTransfer = [] } = wallexInfo;

  const [loading, setLoading] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (errors, values) => {
      setLoading(true);
      if (errors) {
        setLoading(false);
        return;
      }
      await getDetails(values, sellCurrency, buyCurrency, fixedSide);
      setLoading(false);
    });
  };

  const [fixedSide, setFixedSide] = useState('');
  const handleSellAmountChange = event => {
    const { value } = event.target;
    setFixedSide('sell');
    if (!value) {
      setFieldsValue({
        buyAmount: '',
      });
      setFixedSide('');
      return;
    }
    const amount = Number(value);
    const buyAmount = Number(amount / convertionRate).toFixed(2);
    setFieldsValue({
      buyAmount,
    });
  };

  const handleBuyAmountChange = event => {
    const { value } = event.target;
    setFixedSide('buy');
    if (!value) {
      setFieldsValue({
        sellAmount: '',
      });
      setFixedSide('');
      return;
    }
    const amount = Number(value);
    const sellAmount = Number(amount * convertionRate).toFixed(2);
    setFieldsValue({
      sellAmount,
    });
  };

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
  const validators = [greaterThanZero, lessOrEqualBalance];
  const inputAmountDisabled = !balance || !convertionRate;

  return (
    <Form {...formLayoutProps} onSubmit={handleSubmit} hideRequiredMark>
      <AccountSelect
        form={form}
        accounts={accounts}
        paymentType={paymentType}
      />
      <BeneficiarySelect form={form} beneficiaries={beneficiaries} />
      <FundingSourceSelect form={form} sources={fundingSource} />

      {showConvertion && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputItem
            form={form}
            label={
              <span>
                Buy amount&nbsp;
                <Tooltip title="Amount that will be sent to beneficiary">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            id="buyAmount"
            placeholder=""
            disabled={inputAmountDisabled}
            formItemProps={{
              wrapperCol: { xs: 24 },
              help: '&nbsp;',
            }}
            inputProps={{
              addonBefore: buyCurrency,
              onChange: handleBuyAmountChange,
            }}
            style={{
              paddingRight: '1em',
              width: '100%',
            }}
            required
          />
          <div style={{ fontSize: '2em' }}>≈</div>
          <InputItem
            form={form}
            label={
              <span>
                Sell amount&nbsp;
                <Tooltip title="Amount that will be charge off from your account">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </span>
            }
            id="sellAmount"
            placeholder=""
            disabled={inputAmountDisabled}
            formItemProps={{
              wrapperCol: { xs: 24 },
              help: convertionRate ? `Rate: ${convertionRate}` : '',
            }}
            inputProps={{
              addonBefore: sellCurrency,
              onChange: handleSellAmountChange,
            }}
            style={{
              paddingLeft: '1em',
              width: '100%',
            }}
            validators={validators}
            required
          />
        </div>
      )}
      {!showConvertion && (
        <AmountInput form={form} balance={balance} currency={amountCurrency} />
      )}
      <PaymentPurposeSelect form={form} purposes={purposeOfTransfer} />
      <UploadInvoice form={form} setFileId={setFileId} />

      <NoteFieldInput form={form} />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create payment request
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedRequestForm = Form.create()(RemittancePaymentForm);

const RemittancePayment = () => {
  let history = useHistory();
  const [fileId, setFileId] = useState();
  const [beneficiaries] = useAsync(getBeneficiary, []);
  const [companies] = useAsync(getCompanies, []);
  const accounts = useSelector(state => state.accounts);

  const getDetails = async (
    fieldValues,
    sellCurrency,
    buyCurrency,
    fixedSide
  ) => {
    if (!fixedSide) {
      message.error('No fixed side');
      return;
    }
    const {
      [`${fixedSide}Amount`]: amount,
      beneficiaryId: beneficiary_id,
      accountId: account_id,
    } = fieldValues;

    //TODO extract companies into redux
    const company_id = companies[0].id;

    const params = {
      file_id: [fileId],
      amount,
      beneficiary_id,
      account_id,
      company_id,
      buyCurrency,
      sellCurrency,
      fixedSide,
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
          submitState: 'pending',
        })
      );
      history.push(`/payments/remittance/requests/${quoteId}`);
    }
  };

  return (
    <>
      <TopTitle title="Remittance payment request" />
      <Row>
        <Col xs={24} sm={20} md={16} xl={14} xxl={12}>
          <div style={{ marginLeft: '1em' }}>
            <WrappedRequestForm
              accounts={accounts}
              getDetails={getDetails}
              setFileId={setFileId}
              accounts={accounts}
              beneficiaries={beneficiaries}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default RemittancePayment;
