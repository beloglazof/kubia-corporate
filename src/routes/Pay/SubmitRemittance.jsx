import React, { useState } from 'react';
import { Row, Col, Typography, Result, Button } from 'antd';
import TopTitle from '../../components/TopTitle';
import RemittanceDetails from '../../components/RemittanceDetails';
import { useParams, useHistory } from 'react-router-dom';
import { submitRemittance } from '../../api';

const SubmitRemittance = () => {
  let { quoteId } = useParams();
  const quote = JSON.parse(localStorage.getItem(quoteId));
  const {
    paymentDetails,
    purposeOfTransfer,
    fundingSource,
    submitState,
  } = quote;

  const updateStorageQuote = editedQuote => {
    const objectType = '[object Object]';
    if (Object.prototype.toString.call(editedQuote) !== objectType) {
      return;
    }
    const newQuote = { ...quote, ...editedQuote };
    const strigified = JSON.stringify(newQuote);
    localStorage.setItem(quoteId, strigified);
  };

  const sendRemittanceSubmit = async otp => {
    const submitted = await submitRemittance({
      quote_id: quoteId,
      purposeOfTransfer,
      fundingSource,
      otp,
    });

    if (submitted) {
      setState('success');
    }
  };

  const [state, setState] = useState('submit');
  let history = useHistory();
  return (
    <>
      <TopTitle title="Submit remittance request" />
      {state === 'submit' && (
        <RemittanceDetails
          details={paymentDetails}
          onSubmit={sendRemittanceSubmit}
          state={submitState}
          updateStorageQuote={updateStorageQuote}
        />
      )}
      {state === 'success' && (
        <Result
          status="success"
          title="Success!"
          extra={
            <Button
              type="primary"
              onClick={() => history.push('/payments/new')}
            >
              Make new payment
            </Button>
          }
        />
      )}
    </>
  );
};

export default SubmitRemittance;
