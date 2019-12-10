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
import {
  fetchPaymentDetails,
  paymentsPay,
  usersCheck,
  withdrawal
} from '../../api';
import getRandomString from '../../util/getRandomString';
import PaymentInfoForm from '../../components/PaymentInfoForm';
import PaymentDetails from '../../components/PaymentDetails';

export const FormItem = Form.Item;
const { Step } = Steps;

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
      description: note || '',
      idempotency
    };
    request = paymentsPay;
  }
  if (paymentType === 'remittance') {
    params = {
      amount,
      account_id,
      notes: note || '',
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

const formLayoutProps = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 }
  },
  labelAlign: 'left'
};

export const submitButtonLayoutProps = {
  wrapperCol: {
    xs: { offset: formLayoutProps.labelCol.xs.span },
    sm: { offset: formLayoutProps.labelCol.sm.span },
    md: { offset: formLayoutProps.labelCol.md.span }
  }
};

const NewPayment = ({ form, history }) => {
  const [paymentType, setPaymentType] = useState();
  const gotoNextStep = () => gotoStep(current + 1);
  const handleSubmit = async values => {
    sendPaymentRequest(values, paymentType, history);
    gotoNextStep();
  };

  const { current, gotoStep, stepsProps, formProps } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });

  const [paymentDetails, setPaymentDetails] = useState();

  const getDetails = async () => {
    const fetchedDetails = await fetchPaymentDetails();
    if (fetchedDetails) setPaymentDetails(fetchedDetails);
  };

  return (
    <Row>
      <Col span={24}>
        <PageHeader
          title="New Payment Request"
          style={{ marginBottom: '1em' }}
          onBack={() => history.goBack()}
        />
        <Steps {...stepsProps}>
          <Step title="Create" />
          <Step title="Submit" />
          <Step title="Success" />
        </Steps>

        <Form
          {...formLayoutProps}
          {...formProps}
          hideRequiredMark
          style={{ marginTop: '2em' }}
        >
          {current === 0 && (
            <PaymentInfoForm
              form={form}
              setPaymentType={setPaymentType}
              gotoNextStep={gotoNextStep}
              getDetails={getDetails}
            />
          )}
          {current === 1 && (
            <PaymentDetails
              form={form}
              details={paymentDetails}
              gotoNextStep={gotoNextStep}
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
      </Col>
    </Row>
  );
};

export default Form.create()(NewPayment);
