import { useStepsForm } from '@sunflower-antd/steps-form';
import {
  Button,
  Col,
  Form,
  message,
  Result,
  Row,
  Steps,
  PageHeader
} from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchPaymentDetails,
  paymentsPay,
  usersCheck,
  withdrawal,
  getCompanies,
  getBeneficiary,
  submitRemittance
} from '../../api';
import getRandomString from '../../util/getRandomString';
import PaymentInfoForm from '../../components/PaymentInfoForm';
import PaymentDetails from '../../components/PaymentDetails';

export const FormItem = Form.Item;
const { Step } = Steps;

const formLayoutProps = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 6 },
    lg: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 }
  },
  labelAlign: 'left'
};

const submitButtonLayoutProps = {
  wrapperCol: {
    xs: { offset: formLayoutProps.labelCol.xs.span },
    sm: { offset: formLayoutProps.labelCol.sm.span },
    md: { offset: formLayoutProps.labelCol.md.span },
    lg: { offset: formLayoutProps.labelCol.lg.span }
  }
};

const NewPayment = ({ form, history }) => {
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
      idempotency
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
      request: { quoteId: quote_id }
    } = paymentDetails;
    const { purposeOfTransfer, fundingSource } = infoFieldValues;
    const submitted = await submitRemittance({
      purposeOfTransfer,
      quote_id,
      fundingSource,
      otp
    });
    if (submitted) {
      gotoNextStep();
    }
  };

  const { current, gotoStep, stepsProps, formProps } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
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
      account: account_id
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
      fixedSide: 'buy'
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

  return (
    <Row>
      <Col span={24}>
        <PageHeader
          title="New Payment Request"
          onBack={() => history.goBack()}
        />
        {/* <Steps {...stepsProps}>
          <Step />
          <Step />
          <Step />
        </Steps> */}
        <div className="page-content-wrapper">
          <Form
            {...formLayoutProps}
            {...formProps}
            style={{ marginTop: '1em' }}
          >
            {current === 0 && (
              <PaymentInfoForm
                form={form}
                getDetails={getDetails}
                sendInternalRequest={sendInternalRequest}
                setPaymentType={setPaymentType}
                setFileId={setFileId}
                setInfoFieldValues={setInfoFieldValues}
                submitButtonLayoutProps={submitButtonLayoutProps}
              />
            )}
            {current === 1 && (
              <PaymentDetails
                form={form}
                details={paymentDetails}
                gotoNextStep={gotoNextStep}
                onSubmit={handleSubmit}
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
        </div>
      </Col>
    </Row>
  );
};

export default Form.create()(NewPayment);
