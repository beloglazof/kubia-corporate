// @ts-check
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { uniq } from 'lodash';
import PropTypes, { node } from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from 'react-phone-number-input';
import { usersCheck, getCountries, getCompanies } from '../api';
import { PHONE_NUMBER_LENGTH, SINGAPORE_CALLING_CODE } from '../constants';
import useAsync from '../hooks/useAsync';

const { Search } = Input;
const { Option } = Select;

const PhoneInputWithSearchButton = ({
  checkPhone,
  value = '',
  onChange = () => {},
  buttonDisabled,
}) => {
  const [companies] = useAsync(getCompanies);
  const [companyCountryCode, setCompanyCountryCode] = useState();
  useEffect(() => {
    if (!companies) return;
    const companyInfo = companies[0];
    const fields = companyInfo.fields;
    const countryFieldId = 8;
    const countryCodeField = fields.find(field => field.id === countryFieldId);
    const code = countryCodeField.value.toLowerCase();
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
          // autoFormat={false}
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

const PhoneCodeSelector = ({ form }) => {
  const [countries] = useAsync(getCountries, []);
  const countryCodes = uniq(countries.map(({ dial }) => dial.toString()));
  const { getFieldDecorator } = form;
  return getFieldDecorator('phoneCode', {
    initialValue: SINGAPORE_CALLING_CODE,
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
  formItemProps = {},
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
          rules: [
            { required: true, message: 'Please input phone number!' },
            {
              /* {
            len: PHONE_NUMBER_LENGTH
          } */
            },
          ],
          normalize: normalizePhone,
          validateFirst: true,
          validateTrigger: ['onSearch'],
        })(<PhoneInputWithSearchButton checkPhone={checkPhone} />)

        /* <Search
          inputMode="tel"
          addonBefore={<PhoneCodeSelector form={form} />}
          pattern="[0-9]*"
          placeholder="Search people by phone"
          onSearch={checkPhone}
          enterButton
        /> */
        }
      </Form.Item>
    </>
  );
};

SearchUserInput.propTypes = {
  form: PropTypes.object.isRequired,
};

export default SearchUserInput;
