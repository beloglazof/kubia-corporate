// @ts-check
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { uniq } from 'lodash';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import {
  parsePhoneNumber,
  isPossiblePhoneNumber,
} from 'react-phone-number-input';
import { usersCheck, getCompanies } from '../api';
import useAsync from '../hooks/useAsync';

const PhoneInputWithSearchButton = ({
  checkPhone,
  value = '',
  onChange = () => {},
}) => {
  const [companies] = useAsync(getCompanies);
  const [companyCountryCode, setCompanyCountryCode] = useState('sg');
  useEffect(() => {
    if (!companies) {
      return;
    }
    const companyInfo = companies[0];
    const fields = companyInfo.fields;
    if (!fields) {
      return;
    }
    const countryFieldId = 8;
    const countryCodeField = fields.find(field => field.id === countryFieldId);
    const code = countryCodeField?.value.toLowerCase();
    setCompanyCountryCode(code);
  }, [companies]);

  const handleEnterKeyDown = event => {
    if (event.key !== 'Enter') {
      return;
    }
    checkPhone();
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <PhoneInput
          country={companyCountryCode}
          buttonClass="phone-input-dropdown-button"
          inputClass="ant-input"
          dropdownClass="ant-select-dropdown"
          placeholder="Search people by phone"
          value={value}
          onChange={onChange}
          onKeyDown={handleEnterKeyDown}
          enableSearch
        />
      </div>

      <Button
        type="primary"
        icon="search"
        onClick={checkPhone}
        style={{ marginLeft: '1em' }}
      >
        Search
      </Button>
    </div>
  );
};

const hasErrors = fieldsErrors => {
  return Object.keys(fieldsErrors).some(field => fieldsErrors[field]);
};

const SearchUserInput = ({ form, setFoundUser, formItemProps = {} }) => {
  const [user, setUser] = useState({ name: 'user' });
  const { getFieldDecorator } = form;

  const phone = form.getFieldValue('phone');
  useLayoutEffect(() => {
    const fieldHasErrors = hasErrors(form.getFieldsError(['phone']));
    const possiblePhone = isPossiblePhoneNumber(phone);

    if (!phone || !possiblePhone || fieldHasErrors || phone.length < 0) {
      setUser(null);
      if (setFoundUser) {
        setFoundUser(null);
      }
    }
  }, [phone]);

  const normalizePhone = value => {
    if (!value) {
      return;
    }
    const code = form.getFieldValue('phoneCode');

    const pattern = new RegExp(`^\\+${code}|${code}`, 'g');
    return value.replace(pattern, '');
  };

  const checkPhone = async () => {
    // const code = form.getFieldValue('phoneCode');
    const fieldHasErrors = hasErrors(form.getFieldsError(['phone']));
    const phone = form.getFieldValue('phone');
    // const validPhone = isValidPhoneNumber(phone);
    const possiblePhone = isPossiblePhoneNumber(phone);
    if (!possiblePhone) {
      message.error('Impossible phone number');
      return;
    }

    const parsedPhone = parsePhoneNumber(phone);
    if (!parsedPhone) {
      message.warning('Invalid phone number');
      return;
    }
    // if (!code || !phone || fieldHasErrors) {
    //   return null;
    // }
    const phoneWithCode = parsedPhone.number.replace('+', '');

    const userInfo = await usersCheck(phoneWithCode);

    await setUser(userInfo);

    if (setFoundUser) {
      await setFoundUser(userInfo);
    }
    // return userInfo;
  };

  return (
    <>
      <Form.Item extra={user ? user.name : null} {...formItemProps}>
        {getFieldDecorator('phone', {
          rules: [{ required: true, message: 'Please input phone number!' }],
          normalize: normalizePhone,
          validateFirst: true,
        })(<PhoneInputWithSearchButton checkPhone={checkPhone} />)}
      </Form.Item>
    </>
  );
};

SearchUserInput.propTypes = {
  form: PropTypes.object.isRequired,
};

export default SearchUserInput;
