import { usersCheck } from '../../api';
import { Form, Input } from 'antd';
import React, { useState } from 'react';

const InternalRecipientFields = ({ form }) => {
  const [user, setUser] = useState();
  const { getFieldDecorator } = form;

  const formatPhone = value => value.replace(/\+65|65/g, '');

  const validatePhone = async (rule, value, callback) => {
    console.log(value);
    const fetchedUser = await usersCheck(`65${value}`, false);
    setUser(fetchedUser);

    if (fetchedUser && fetchedUser.phone === value) {
      callback();
    } else {
      callback('Phone not found');
    }
  };
  return (
    <Form.Item label="Phone Number" hasFeedback extra={user ? user.name : null}>
      {getFieldDecorator('phone', {
        rules: [
          { required: true, message: 'Please input recipient phone number!' },
          { validator: validatePhone }
        ],
        normalize: formatPhone
      })(
        <Input
          inputMode={'tel'}
          addonBefore={'+65'}
          pattern={'[0-9]*'}
        />
      )}
    </Form.Item>
  );
};

export default InternalRecipientFields;
