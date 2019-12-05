import React, { useState, useLayoutEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { uniq } from 'lodash';
import { usersCheck, getCountries } from '../api';
import { PHONE_NUMBER_LENGTH, SINGAPORE_CALLING_CODE } from '../constants';
import useAsync from '../hooks/useAsync';

const { Search } = Input;
const { Option } = Select;

const hasErrors = fieldsErrors => {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field]);
};
const SearchUserInput = ({
  form,
  setFoundUser,
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
  const getPhoneWithCode = (code, phone) => {
    if (hasCode(phone)) return phone;

    return `${code}${phone}`;
  };

  const checkPhone = async () => {
    const code = form.getFieldValue('phoneCode');
    const phone = form.getFieldValue('phone');
    const phoneWithCode = getPhoneWithCode(code, phone);

    const userInfo = await usersCheck(phoneWithCode);

    await setUser(userInfo);

    if (setFoundUser) {
      await setFoundUser(userInfo);
    }
    return userInfo;
  };

  const validatePhone = async (rule, value, callback) => {
    const userInfo = await checkPhone();
    if (userInfo && userInfo.phone === value) {
      callback();
    } else {
      callback('Phone not found');
    }
  };

  const [countries] = useAsync(getCountries, []);
  const countryCodes = uniq(countries.map(({ dial }) => dial.toString()));
  const codeSelector = getFieldDecorator('phoneCode', {
    initialValue: SINGAPORE_CALLING_CODE,
    rules: [{ validator: validatePhone }]
  })(
    <Select style={{ width: '70px' }}>
      {countryCodes.map(code => {
        return (
          <Option value={code} key={code}>
            +{code}
          </Option>
        );
      })}
    </Select>
  );
  return (
    <Form.Item label={label} extra={user ? user.name : null} {...formItemProps}>
      {getFieldDecorator('phone', {
        rules: [
          { required: true, message: 'Please input phone number!' },
          {
            len: PHONE_NUMBER_LENGTH
          },
          { validator: validatePhone }
        ],
        normalize: normalizePhone,
        validateFirst: true
      })(
        <Search
          inputMode="tel"
          addonBefore={codeSelector}
          pattern="[0-9]*"
          placeholder="Search people by phone"
        />
      )}
    </Form.Item>
  );
};

export default SearchUserInput;
