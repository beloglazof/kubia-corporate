import { usersCheck } from '../../api';
import { Form, Input } from 'antd';
import React, { useState, useLayoutEffect } from 'react';
import { PHONE_NUMBER_LENGTH, SINGAPORE_CALLING_CODE } from '../../constants';

const SearchUserByPhoneWrapper = ({
  form,
  setFoundUser,
  children,
  label = 'Phone number',
  formItemProps
}) => {
  const [user, setUser] = useState();
  const { getFieldDecorator } = form;

  useLayoutEffect(() => {
    const phone = form.getFieldValue('phone');
    if (!phone || !phone.length) {
      setUser(null);
    }
  });
  const hasCode = phone => phone.startsWith('65') || phone.startsWith('+65');

  const normalizePhone = value => value && value.replace(/^\+65|65/g, '');
  const phoneWithCode = phone => {
    if (hasCode(phone)) return phone;

    return `${SINGAPORE_CALLING_CODE}${phone}`;
  };

  const checkPhone = async (rule, value, callback) => {
    const userInfo = await usersCheck(phoneWithCode(value), false);
    setUser(userInfo);

    if (setFoundUser) {
      setFoundUser(userInfo);
    }

    if (userInfo && userInfo.phone === value) {
      callback();
    } else {
      callback('Phone not found');
    }
  };
  return (
    <Form.Item label={label} extra={user ? user.name : null} {...formItemProps}>
      {getFieldDecorator('phone', {
        rules: [
          { required: true, message: 'Please input phone number!' },
          {
            len: PHONE_NUMBER_LENGTH,
            message: 'Not enough digits in phone number'
          },
          { validator: checkPhone }
        ],
        normalize: normalizePhone,
        validateFirst: true
      })(children || PhoneInput)}
    </Form.Item>
  );
};

export default SearchUserByPhoneWrapper;

const PhoneInput = () => {
  return <Input inputMode={'tel'} addonBefore={'+65'} pattern={'[0-9]*'} />;
};
