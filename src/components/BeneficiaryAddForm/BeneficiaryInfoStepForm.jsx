import InputItem from './InputItem';
import { startCase } from 'lodash';
import React from 'react';
import { Button, Form } from 'antd';

const BeneficiaryInfoStepForm = ({ form, fields, submit }) => {
  return (
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
      <Form.Item wrapperCol={{offset: 6}}>
        <Button type="primary" htmlType="submit" onClick={() => submit()}>
          Submit
        </Button>
      </Form.Item>
    </>
  );
};

export default BeneficiaryInfoStepForm;

const renderFields = (fields, form) => {
  if (!fields || typeof fields !== 'object') return null;
  const filterFields = ([name]) => name !== 'entityType';

  const renderField = ([fieldName, value]) => {
    if (typeof value === 'object') {
      return renderFields(value, form);
    }
    const selectedCountry = form.getFieldValue('country').toLowerCase();
    const isCityField = fieldName === 'city';
    const disabledFields = new Set(['entityType', 'country']);
    if (isCityField && selectedCountry === 'sg') {
      disabledFields.add(fieldName);
    }
    const initialValue =
      isCityField && selectedCountry === 'sg' ? 'Singapore' : null;
    const disabled = disabledFields.has(fieldName);
    const startCasedName = startCase(fieldName);
    const label = fieldName === 'bicSwift' ? 'SWIFT' : startCasedName;
    const placeholder = label;

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
