import { Button, Descriptions, Form, Input } from 'antd';
import { startCase } from 'lodash/string';
import React, { useState } from 'react';
import { getWallexOTP, submitRemittance } from '../api';
import InputItem from './InputItem';
import { formatISODate } from '../util';

import styles from './RemittanceDetails.module.css';

const renderFields = fields => {
  if (!fields) return null;
  return Object.entries(fields).map(field => {
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
      // case 'total':
      //   label = 'Total Amount';
      //   value = fieldValue;
      //   break;
      case 'expiresAt':
        value = formatISODate(fieldValue);
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

const RemittanceDetails = ({
  details,
  onSubmit,
  updateStorageQuote,
  state = 'pending',
}) => {
  const [submitState, setSubmitState] = useState(state);
  const requestOTP = async () => {
    const OTPRequested = await getWallexOTP(request.quoteId);
    if (OTPRequested) {
      updateStorageQuote({ submitState: 'OTP' });
      setSubmitState('OTP');
    }
  };

  const handleSend = () => {
    onSubmit(OTP);
  };

  const [OTP, setOTP] = useState();
  const disabled = !OTP || OTP.length < 6;

  const visibleRequestFieldSet = new Set([
    'sellCurrency',
    'buyCurrency',
    'expiresAt',
  ]);
  const { request, fees } = details;
  const { sellCurrency, buyCurrency, sellAmount } = request;
  if (sellCurrency !== buyCurrency) {
    visibleRequestFieldSet.add('buyAmount');
    visibleRequestFieldSet.add('sellAmount');
    visibleRequestFieldSet.add('rate');
  }
  const filteredFields = Object.keys(request)
    .filter(fieldName => visibleRequestFieldSet.has(fieldName))
    .reduce(
      (acc, fieldName) => ({ ...acc, [fieldName]: request[fieldName] }),
      {}
    );

  const { total: totalFee } = fees;
  const totalAmount = totalFee + sellAmount;
  const fields = { ...filteredFields, totalFee, totalAmount };
  const amountBoxStyle = {
    border: '1px solid #e0e0e0',
    borderRadius: '32px',
    width: '150px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '1em',
  };

  const OTPInputStyle = {
    marginBottom: '1em',
    width: '200px',
  };
  return (
    <>
      {/* <Descriptions bordered column={1} style={{ marginBottom: '1em' }}>
        {renderFields(fields)}
      </Descriptions> */}

      <div
        style={{
          marginBottom: '1em',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <div style={amountBoxStyle}>
          <span style={{ fontSize: '1em' }}>Sell amount</span>
          <span style={{ fontSize: '2em' }}>
            {sellAmount} {sellCurrency}
          </span>
        </div>
        <div className={styles.arrowBox}>
          <span>Fee {totalFee}</span>
        </div>
        <div style={amountBoxStyle}>
          <span style={{ fontSize: '1em' }}>Total amount</span>
          <span style={{ fontSize: '2em' }}>
            {totalAmount} {sellCurrency}
          </span>
        </div>
      </div>

      {submitState === 'pending' && (
        <Button type="primary" onClick={requestOTP}>
          Submit payment
        </Button>
      )}
      {submitState === 'OTP' && (
        <>
          <Input
            id="otp"
            label="Code"
            placeholder="Code from SMS"
            onChange={e => setOTP(e.target.value)}
            maxLength={6}
            style={OTPInputStyle}
          />
          <br />
          <Button type="primary" disabled={disabled} onClick={handleSend}>
            Send
          </Button>
        </>
      )}
    </>
  );
};

export default RemittanceDetails;
