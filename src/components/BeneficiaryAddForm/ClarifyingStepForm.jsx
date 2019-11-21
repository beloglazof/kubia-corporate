import React from 'react';
import SelectItem from './SelectItem';

const ClarifyingStepForm = ({ form, countries, currencies }) => {
  const fieldProps = { form };
  const countryOptions = countries
    ? countries.map(c => ({ value: c.iso2, title: c.name }))
    : [];
  const countryLoading = !countries || countries.length === 0;
  const currencyOptions = currencies
    ? currencies.map(c => ({ value: c.code, title: c.name }))
    : [];
  const currencyLoading = !currencies || currencies.length === 0;

  return (
    <>
      <CountrySelect
        options={countryOptions}
        loading={countryLoading}
        {...fieldProps}
      />
      <BankAccountCountrySelect
        options={countryOptions}
        loading={countryLoading}
        {...fieldProps}
      />
      <CurrencySelect
        options={currencyOptions}
        loading={currencyLoading}
        {...fieldProps}
      />
      <TypeSelect {...fieldProps} />
    </>
  );
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

const CountrySelect = props => (
  <SelectItem
    label="Country"
    id="country"
    required
    showSearch
    filterOption={filterCountry}
    {...props}
  />
);

const BankAccountCountrySelect = props => (
  <SelectItem
    label="Bank Account Country"
    id="bankAccountCountry"
    required
    showSearch
    filterOption={filterCountry}
    {...props}
  />
);

const CurrencySelect = props => (
  <SelectItem label="Currency" id="currency" required {...props} />
);
