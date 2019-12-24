import React from 'react';
import InputItem from '../InputItem';
import PropTypes from 'prop-types';

const PaymentReferenceInput = ({ form }) => (
  <InputItem
    form={form}
    id="paymentRefrence"
    label="Payment Reference"
    placeholder="For family"
  />
);

PaymentReferenceInput.propTypes = {
  form: PropTypes.object.isRequired,
};

export default PaymentReferenceInput;
