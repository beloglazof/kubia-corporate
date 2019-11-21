import InputItem from './InputItem';
import { startCase } from 'lodash';
import React from 'react';

const renderFields = (fields, form) => {
  const filterFields = ([name]) => name !== 'entityType';
  const renderField = ([name, value]) => {
    if (typeof value === 'object') {
      return renderFields(value, form);
    }
    const disabledFields = new Set(['entityType', 'country']);
    const disabled = disabledFields.has(name);
    return (
      <InputItem
        form={form}
        id={name}
        placeholder={startCase(name)}
        label={startCase(name)}
        validationPattern={value}
        key={name}
        required
        disabled={disabled}
      />
    );
  };
  return Object.entries(fields).map(renderField);
};
const BeneficiaryInfoStepForm = ({ form, fields }) => {
  return (
    <>
      <InputItem
        form={form}
        label="Nickname"
        id="nickname"
        placeholder="Alias for counterparty"
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
    </>
  );
};

export default BeneficiaryInfoStepForm;
