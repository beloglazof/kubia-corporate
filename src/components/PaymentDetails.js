import { Button, Descriptions, Form, Input } from 'antd';
import { startCase } from 'lodash/string';
import React, { useState } from 'react';
import { getWallexOTP, submitRemittance } from '../api';
import InputItem from './InputItem';
import { formatISODate } from '../util';

const PaymentDetails = ({ form, details, gotoNextStep, onSubmit }) => {
  const fieldsSet = new Set([
    'sellCurrency',
    'buyCurrency',
    'expiresAt',
    'kubia',
    'total'
  ]);
  const { sellCurrency, buyCurrency } = details;
  if (sellCurrency !== buyCurrency) {
    fieldsSet.add('buyAmount');
    fieldsSet.add('sellAmount');
    fieldsSet.add('rate');
  }
  const renderFields = fields => {
    if (!fields) return null;
    return Object.entries(fields)
      .filter(([fieldName]) => fieldsSet.has(fieldName))
      .map(field => {
        const [fieldName, fieldValue] = field;
        let label = startCase(fieldName);
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
          case 'kubia':
            label = 'Total Fee';
            value = fieldValue;
            break;
          case 'total':
            label = 'Total Amount';
            value = fieldValue;
            break;
          case 'expiresAt':
            value = formatISODate(fieldValue)
            break;
          default:
            value = fieldValue;
            break;
        }
        return (
          <Descriptions.Item label={label} key={label}>
            <span style={{ fontWeight: '600' }}>{value}</span>
          </Descriptions.Item>
        );
      });
  };
  const [submitState, setSubmitState] = useState('pending');
  const handleSubmitClick = async () => {
    // -> request otp

    const OTPRequested = await getWallexOTP(details.quoteId);
    //   new Promise(resolve =>
    //   setTimeout(() => resolve(true), 2000)
    // );
    if (OTPRequested) {
      setSubmitState('OTP');
    }
  };
  // const handleOTPSendClick = async () => {
  //   // -> send otp and payment id
  //   const submitted = await onSubmit(OTP);
  //   // new Promise(resolve =>
  //   //   setTimeout(() => resolve(true), 2000)
  //   // );
  //   if (submitted) {
  //     setSubmitState('submitted');
  //     gotoNextStep();
  //   }
  // };
  return (
    <>
      <Descriptions bordered column={1} style={{ marginBottom: '1em' }}>
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
            <InputItem
              form={form}
              id="otp"
              label="Code"
              placeholder="Code from SMS"
            />

            {/*<Input*/}
            {/*  id="otp"*/}
            {/*  label="Code"*/}
            {/*  placeholder="Code from SMS"*/}
            {/*  onChange={e => setOTP(e.target.value)}*/}
            {/*/>*/}
            <Button type="primary" htmlType="submit">
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
