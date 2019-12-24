// @ts-check
import React, { useState, useLayoutEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { uniq } from 'lodash';
import PropTypes from 'prop-types';
import { usersCheck, getCountries } from '../api';
import { PHONE_NUMBER_LENGTH, SINGAPORE_CALLING_CODE } from '../constants';
import useAsync from '../hooks/useAsync';

const { Search } = Input;
const { Option } = Select;

const hasErrors = fieldsErrors => {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field]);
};

const PhoneCodeSelector = ({ form }) => {
  const [countries] = useAsync(getCountries, []);
  const countryCodes = uniq(countries.map(({ dial }) => dial.toString()));
  const { getFieldDecorator } = form;
  return getFieldDecorator('phoneCode', {
    initialValue: SINGAPORE_CALLING_CODE
  })(
    <Select showSearch style={{ width: '70px' }}>
      {countryCodes.map(code => {
        return (
          <Option value={code} key={code}>
            +{code}
          </Option>
        );
      })}
    </Select>
  );
};
const SearchUserInput = ({
  form,
  setFoundUser,
  label = 'Phone number',
  formItemProps = {}
}) => {
  const [user, setUser] = useState();
  const { getFieldDecorator } = form;

  useLayoutEffect(() => {
    const phone = form.getFieldValue('phone');
    const fieldHasErrors = hasErrors(form.getFieldsError(['phone']));
    if (!phone || fieldHasErrors || phone.length < 0) {
      setUser(null);
      if (setFoundUser) {
        setFoundUser(null);
      }
    }
  });

  const normalizePhone = value => {
    if (!value) {
      return;
    }
    const code = form.getFieldValue('phoneCode');

    const pattern = new RegExp(`^\\+${code}|${code}`, 'g');
    return value.replace(pattern, '');
  };

  const checkPhone = async () => {
    const code = form.getFieldValue('phoneCode');
    const phone = form.getFieldValue('phone');
    const fieldHasErrors = hasErrors(form.getFieldsError(['phone']));

    if (!code || !phone || fieldHasErrors) {
      return null;
    }
    const phoneWithCode = `${code}${phone}`;

    const userInfo = await usersCheck(phoneWithCode);

    await setUser(userInfo);

    if (setFoundUser) {
      await setFoundUser(userInfo);
    }
    return userInfo;
  };

  return (
    <Form.Item extra={user ? user.name : null} {...formItemProps}>
      {getFieldDecorator('phone', {
        rules: [
          { required: true, message: 'Please input phone number!' },
          {
            len: PHONE_NUMBER_LENGTH
          }
        ],
        normalize: normalizePhone,
        validateFirst: true,
        validateTrigger: ['onSearch']
      })(
        <Search
          inputMode="tel"
          addonBefore={<PhoneCodeSelector form={form} />}
          pattern="[0-9]*"
          placeholder="Search people by phone"
          onSearch={checkPhone}
          enterButton
        />
      )}
    </Form.Item>
  );
};

SearchUserInput.propTypes = {
  form: PropTypes.object.isRequired
};

export default SearchUserInput;
