import { Button, Descriptions, Form, Input } from 'antd';
import { startCase } from 'lodash/string';
import React, { useState } from 'react';

const PaymentDetails = ({ details, gotoNextStep }) => {
  const renderFields = fields => {
    if (!fields) return null;
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
  const [submitState, setSubmitState] = useState('pending');
  const handleSubmitClick = async () => {
    // -> request otp
    const OTPRequested = await new Promise(resolve =>
      setTimeout(() => resolve(true), 2000)
    );
    if (OTPRequested) {
      setSubmitState('OTP');
    }
  };
  const [_, setOTP] = useState();
  const handleOTPSendClick = async () => {
    // -> send otp and payment id
    const submitted = await new Promise(resolve =>
      setTimeout(() => resolve(true), 2000)
    );
    if (submitted) {
      setSubmitState('submitted');
      gotoNextStep();
    }
  };
  return (
    <>
      <Descriptions bordered column={2} style={{ marginBottom: '1em' }}>
        {renderFields(details)}
      </Descriptions>
      {submitState === 'pending' && (
        <Form.Item>
          <Button type="primary" onClick={handleSubmitClick}>
            Submit payment
          </Button>
        </Form.Item>
      )}
      {submitState === 'OTP' && (
        <>
          <Form.Item>
            <Input
              id="otp"
              label="Code"
              placeholder="Code from SMS"
              onChange={e => setOTP(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleOTPSendClick}>
              Send
            </Button>
          </Form.Item>
        </>
      )}
    </>
  );
  // confirm button
  // -> request otp
  // -> otp input
  // -> send otp and payment id
};

export default PaymentDetails;
