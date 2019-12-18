import { startCase } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'antd';

import InputItem from '../InputItem';
import CountrySelect from '../CountrySelect';
const renderFields = (fields, form) => {
  if (!fields || typeof fields !== 'object') return null;
  const filterFields = ([name]) => name !== 'entityType';

  const renderField = ([fieldName, value]) => {
    if (typeof value === 'object') {
      return renderFields(value, form);
    }
    const isCityField = fieldName === 'city';
    const disabledFields = new Set(['entityType', 'country']);
    const selectedCountry = form.getFieldValue('country').toLowerCase();
    if (isCityField && selectedCountry === 'sg') {
      disabledFields.add(fieldName);
    }
    const initialValue =
      isCityField && selectedCountry === 'sg' ? 'Singapore' : null;

    const disabled = disabledFields.has(fieldName);

    const startCasedName = startCase(fieldName);
    const label = fieldName === 'bicSwift' ? 'SWIFT' : startCasedName;
    const placeholder = label;

    const isCountryField = fieldName === 'country';
    if (isCountryField) {
      return (
        <CountrySelect
          form={form}
          label={label}
          id={fieldName}
          disabled={disabled}
        />
      );
    }

    return (
      <InputItem
        form={form}
        id={fieldName}
        placeholder={placeholder}
        label={label}
        validationPattern={value}
        key={fieldName}
        disabled={disabled}
        initialValue={initialValue}
        required
      />
    );
  };
  return Object.entries(fields)
    .filter(filterFields)
    .map(renderField);
};

const BeneficiaryInfoStepForm = ({ form, fields, submitButtonLayoutProps }) => (
  <>
    <InputItem
      form={form}
      label="Beneficiary alias"
      id="nickname"
      placeholder="New Partner"
      required
    />
    <InputItem
      form={form}
      label="Email"
      id="email"
      placeholder="Email"
      required
    />
    {renderFields(fields, form)}
    <Form.Item {...submitButtonLayoutProps}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </>
);

BeneficiaryInfoStepForm.propTypes = {
  form: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  submit: PropTypes.func.isRequired,
};

export default BeneficiaryInfoStepForm;
