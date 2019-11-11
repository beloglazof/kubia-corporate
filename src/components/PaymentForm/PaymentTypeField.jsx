import { Form, Radio } from 'antd';
import React from 'react';

const PaymentTypeField = ({ form }) => {
  const { getFieldDecorator } = form;
  
  return (
    <Form.Item label="Payment Type">
      {getFieldDecorator('paymentType', {
        rules: [{ required: true, message: 'Please choose payment type!' }]
      })(
        <Radio.Group>
          <Radio.Button value="internal">Internal</Radio.Button>
          <Radio.Button value="remittance">Remittance</Radio.Button>
        </Radio.Group>
      )}
    </Form.Item>
  );
};

export default PaymentTypeField;
