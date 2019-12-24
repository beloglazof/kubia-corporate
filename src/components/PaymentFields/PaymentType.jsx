import React from 'react';
import { Form, Radio } from 'antd';
import PropTypes from 'prop-types';

const PaymentType = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <Form.Item label="Payment Type">
      {getFieldDecorator('paymentType', {
        initialValue: 'remittance',
        rules: [{ required: true, message: 'Please choose payment type!' }],
      })(
        <Radio.Group>
          <Radio.Button value="internal">Internal</Radio.Button>
          <Radio.Button value="remittance">Remittance</Radio.Button>
        </Radio.Group>
      )}
    </Form.Item>
  );
};

PaymentType.propTypes = {
  form: PropTypes.object.isRequired,
};

export default PaymentType;
