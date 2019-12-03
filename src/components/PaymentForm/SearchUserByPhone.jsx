import { usersCheck } from '../../api';
import { Form, Input } from 'antd';
import React, { useState, useLayoutEffect } from 'react';
import { PHONE_NUMBER_LENGTH, SINGAPORE_CALLING_CODE } from '../../constants';

const hasErrors = fieldsErrors => {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field]);
};
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
    // const phone = form.getFieldValue('phone');
    if (hasErrors(form.getFieldsError(['phone']))) {
      setUser(null);
      if (setFoundUser) {
        setFoundUser(null);
      }
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
            len: PHONE_NUMBER_LENGTH
          },
          { validator: checkPhone }
        ],
        normalize: normalizePhone,
        validateFirst: true
      })(
        children || (
          <Input
            inputMode={'tel'}
            addonBefore={'+65'}
            pattern={'[0-9]*'}
          />
        )
      )}
    </Form.Item>
  );
};

export default SearchUserByPhoneWrapper;

export const PhoneInput = props => {
  return (
    <Input
      inputMode={'tel'}
      addonBefore={'+65'}
      pattern={'[0-9]*'}
      {...props}
    />
  );
};
