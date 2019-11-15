import { usersCheck } from '../../api';
import { Form, Input } from 'antd';
import React, { useState } from 'react';
import { PHONE_NUMBER_LENGTH } from '../../constants';

const InternalRecipientFields = ({ form }) => {
  const [user, setUser] = useState();
  const { getFieldDecorator } = form;

  const formatPhone = value => value && value.replace(/\+65|65/g, '');

  const validatePhone = async (rule, value, callback) => {
    if (value.length !== PHONE_NUMBER_LENGTH) {
      return callback('Not enough digits in phone number');
    }

    const user = await usersCheck(`65${value}`, false);
    setUser(user);

    if (user && user.phone === value) {
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
      })(<Input inputMode={'tel'} addonBefore={'+65'} pattern={'[0-9]*'} />)}
    </Form.Item>
  );
};

export default InternalRecipientFields;
