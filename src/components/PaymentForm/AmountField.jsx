import { Form, Input, InputNumber } from 'antd';
import React from 'react';

const AmountField = ({ balance, form }) => {
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

  const formatter = value =>
    `S$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const parser = value => value.replace(/S\$\s?|(,*)/g, '');
  
  return (
    <Form.Item label="Amount" hasFeedback>
      {getFieldDecorator('amount', {
        rules: [
          { required: true, message: 'Please enter amount!' },
          { validator: greaterThanZero },
          { validator: lessOrEqualBalance },
        ]
      })(<Input pattern="[0-9]*" inputMode="numeric" addonBefore={'S$'} />)}
    </Form.Item>
  );
};

export default AmountField;
