import { useStepsForm } from '@sunflower-antd/steps-form';
import {
  Button,
  Col,
  Form,
  message,
  Radio,
  Row,
  Steps,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  fetchPaymentDetails,
  getBeneficiary,
  getCompanies,
  getPeople,
  paymentsPay,
  submitRemittance,
} from '../../api';
import {
  AccountSelect,
  AmountInput,
  LinkedUserSelect,
  NoteFieldInput,
} from '../../components/PaymentFields';
import useAsync from '../../hooks/useAsync';
import getRandomString from '../../util/getRandomString';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';

const { Step } = Steps;
const formLayoutProps = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 6 },
    lg: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
  },
  labelAlign: 'left',
};

const submitButtonLayoutProps = {
  wrapperCol: {
    xs: { offset: formLayoutProps.labelCol.xs.span },
    sm: { offset: formLayoutProps.labelCol.sm.span },
    md: { offset: formLayoutProps.labelCol.md.span },
    lg: { offset: formLayoutProps.labelCol.lg.span },
  },
};

const PayPage = ({ form, history }) => {
  const [paymentType, setPaymentType] = useState();
  const gotoNextStep = () => gotoStep(current + 1);
  const sendInternalRequest = async (
    amount,
    account_id,
    user_id,
    description
  ) => {
    const idempotency = getRandomString();
    const params = {
      amount,
      account_id,
      user_id,
      description,
      idempotency,
    };

    try {
      const response = await paymentsPay(params);
      if (response) {
        gotoStep(2);
      }
    } catch (error) {
      const err = error.response.data.error[0];
      const msg = `${err.message} ${err.code}`;
      message.error(msg);
    }
  };
  const handleSubmit = async ({ otp }) => {
    // sendPaymentRequest(values, paymentType, history);
    const {
      request: { quoteId: quote_id },
    } = paymentDetails;
    const { purposeOfTransfer, fundingSource } = infoFieldValues;
    const submitted = await submitRemittance({
      purposeOfTransfer,
      quote_id,
      fundingSource,
      otp,
    });
    if (submitted) {
      gotoNextStep();
    }
  };

  const { current, gotoStep, stepsProps, formProps } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3,
  });

  const [paymentDetails, setPaymentDetails] = useState();
  const [fileId, setFileId] = useState();
  const [infoFieldValues, setInfoFieldValues] = useState();

  const accounts = useSelector(state => state.accounts);

  const getDetails = async fieldValues => {
    setInfoFieldValues(fieldValues);
    const {
      amount,
      beneficiary: beneficiary_id,
      account: account_id,
    } = fieldValues;
    const companies = await getCompanies();
    const company_id = companies[0].id;
    const account = accounts.find(acc => acc.id === account_id);
    const sellCurrency = account.currency_info.code;
    const beneficiaries = await getBeneficiary();
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
    // console.log(beneficiary);
    // console.log(params);
    const fetchedDetails = await fetchPaymentDetails(params);
    if (fetchedDetails) {
      setPaymentDetails(fetchedDetails);
      gotoNextStep();
    } else {
      console.log('no fetched data');
      return false;
    }
  };
  const buttonWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-around',
  };

  const typeButtonStyle = {
    width: '80%',
    height: '100px',
  };

  let { url } = useRouteMatch();
  let location = useLocation();
  const fromAccountId = location.state?.fromAccountId;
  return (
    <Row>
      <Col span={24}>
        <div className="page-content-wrapper">
          {/* <PageHeader
            title="Choose Payment Type"
            onBack={() => history.goBack()}
          /> */}
          <Row style={{ marginBottom: '2em' }}>
            <Col span={24}>
              <Typography.Title level={2} style={{ marginBottom: '0.2em' }}>
                Choose payment type
              </Typography.Title>
              <Button
                icon="left"
                onClick={() => history.goBack()}
                style={{ padding: 0 }}
                type="link"
              >
                Go back
              </Button>
            </Col>
          </Row>

          {/* <Radio.Group size="large">
            <Radio.Button value="internal">Internal</Radio.Button>
            <Radio.Button value="remittance">Remittance</Radio.Button>
          </Radio.Group> */}
          <Row type="flex">
            <Col span={6} style={buttonWrapperStyle}>
              <Button
                type="primary"
                size="large"
                style={typeButtonStyle}
                onClick={() =>
                  history.push(`${url}/internal`, { fromAccountId })
                }
              >
                Internal
              </Button>
            </Col>
            <Col span={6} offset={4} style={buttonWrapperStyle}>
              <Button
                type="primary"
                size="large"
                style={typeButtonStyle}
                onClick={() =>
                  history.push(`${url}/remittance`, { fromAccountId })
                }
              >
                Remittance
              </Button>
            </Col>
          </Row>
          {/* <Form
            {...formLayoutProps}
            {...formProps}
            style={{ marginTop: '1em' }}
            hideRequiredMark
          >
            <PaymentInfoForm
              form={form}
              getDetails={getDetails}
              sendInternalRequest={sendInternalRequest}
              setPaymentType={setPaymentType}
              setFileId={setFileId}
              setInfoFieldValues={setInfoFieldValues}
              submitButtonLayoutProps={submitButtonLayoutProps}
            />
          </Form> */}
          {/* {current === 1 && (
              <PaymentDetails
                form={form}
                details={paymentDetails}
                gotoNextStep={gotoNextStep}
                onSubmit={handleSubmit}
              />
            )} */}
          {/* {current === 2 && (
            <Result
              status="success"
              title="Request succefully submitted!"
              extra={
                <>
                  <Button type="primary" onClick={() => gotoStep(0)}>
                    Make new payment
                  </Button>
                </>
              }
            />
          )} */}
        </div>
      </Col>
    </Row>
  );
};

export default Form.create()(PayPage);
