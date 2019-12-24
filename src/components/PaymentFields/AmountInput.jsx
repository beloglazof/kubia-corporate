import React, { useEffect } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';

const AmountInput = ({ balance, form, currency }) => {
  const { getFieldDecorator } = form;
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
  const [disabled, setDisabled] = useState(true);
  useEffect(() => {
    if (balance && currency) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [balance, currency]);
  return (
    <Form.Item label="Amount">
      {getFieldDecorator('amount', {
        rules: [
          { required: true, message: 'Please enter amount!' },
          { validator: greaterThanZero },
          { validator: lessOrEqualBalance },
        ],
        validateFirst: true
      })(
        <Input
          pattern="[0-9]*"
          inputMode="numeric"
          addonBefore={currency}
          disabled={disabled}
        />
      )}
    </Form.Item>
  );
};

AmountInput.propType = {
  balance: PropTypes.number.isRequired,
  form: PropTypes.object.isRequired,
};

export default AmountInput;
