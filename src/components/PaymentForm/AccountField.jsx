import { Form, Select } from 'antd';
import React from 'react';

const renderAccountOptions = account => {
  const { number, amount, id } = account;
  const title = `${number} | Balance: S$ ${amount}`;
  return (
    <Select.Option value={account} key={id}>
      {title}
    </Select.Option>
  );
};
const AccountField = ({ accounts, form }) => {
  const { getFieldDecorator } = form;

  return (
    <Form.Item label="Account" hasFeedback>
      {getFieldDecorator('account', {
        rules: [{ required: true, message: 'Account is not selected!' }]
      })(
        <Select placeholder="Please select account">
          {accounts && accounts.map(renderAccountOptions)}
        </Select>
      )}
    </Form.Item>
  );
};

export default AccountField;
