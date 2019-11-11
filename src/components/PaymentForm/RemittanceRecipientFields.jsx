import React from 'react';
import { Form, Input } from 'antd';

const RemittanceRecipientFields = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <React.Fragment>
      <Form.Item label="SWIFT">
        {getFieldDecorator('swift', {
          rules: [
            { required: true, message: 'Please enter recipient bank SWIFT' }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Account id">
        {getFieldDecorator('accountId', {
          rules: [
            { required: true, message: 'Please enter recipient account id' }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Bank name">
        {getFieldDecorator('bankName')(<Input />)}
      </Form.Item>
      <Form.Item label="Bank code">
        {getFieldDecorator('bankCode', {
          rules: [
            { required: true, message: 'Please enter recipient bank code' }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Bank branch code">
        {getFieldDecorator('bankBranchCode')(<Input />)}
      </Form.Item>
      <Form.Item label="Bank address">
        {getFieldDecorator('bankAddress')(<Input />)}
      </Form.Item>
    </React.Fragment>
  );
};

export default RemittanceRecipientFields;
