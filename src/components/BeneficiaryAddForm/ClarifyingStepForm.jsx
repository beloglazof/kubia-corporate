import React from 'react';
import SelectItem from './SelectItem';
import { Button, Form, message } from 'antd';
import { getBeneficiaryFields } from '../../api';

const ClarifyingStepForm = ({ form, countries, currencies, setMainFormFields, gotoStep, current }) => {
  const countryOptions = countries
    ? countries.map(c => ({ value: c.iso2, title: c.name }))
    : [];
  const countryLoading = !countries || countries.length === 0;

  const currencyOptions = currencies
    ? currencies.map(c => ({ value: c.code, title: c.name }))
    : [];
  const currencyLoading = !currencies || currencies.length === 0;

  const handleNext = async () => {
    form.validateFields(async (errors, values) => {
      if (errors) return;
      const mainFormFields = await getMainFormFields(values);
      if (mainFormFields) {
        setMainFormFields(mainFormFields);
        gotoStep(current + 1);
      } else {
        message.error('We do not support selected configuration.', 5)
      }
    });
  };

  const countrySelectProps = {
    options: countryOptions,
    loading: countryLoading,
    form
  };

  return (
    <>
      <CountrySelect {...countrySelectProps} />
      <BankAccountCountrySelect {...countrySelectProps} />
      <CurrencySelect
        options={currencyOptions}
        loading={currencyLoading}
        form={form}
      />
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" onClick={handleNext}>
          Next
        </Button>
      </Form.Item>
    </>
  );
};

const getMainFormFields = async values => {
  const { country, bankAccountCountry, currency } = values;
  const response = await getBeneficiaryFields(
    currency,
    bankAccountCountry,
    country
  );
  if (!response) {
    return;
  }
  const data = response[0]?.data;
  const fields = data?.find(item => item.entityType === 'company');
  return fields;
};

export default ClarifyingStepForm;

const TypeSelect = ({ form }) => {
  const options = [
    { value: 'company', title: 'Company' },
    { value: 'individual', title: 'Individual' }
  ];
  return (
    <SelectItem
      form={form}
      label="Type"
      id="entityType"
      options={options}
      required
    />
  );
};

const filterCountry = (inputValue, option) => {
  return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
};

const CountrySelect = ({ label = 'Country', id = 'country', ...props }) => (
  <SelectItem
    label={label}
    id={id}
    required
    showSearch
    filterOption={filterCountry}
    {...props}
  />
);

const BankAccountCountrySelect = props => (
  <CountrySelect
    label="Bank Account Country"
    id="bankAccountCountry"
    {...props}
  />
);

const CurrencySelect = props => (
  <SelectItem label="Currency" id="currency" required {...props} />
);
