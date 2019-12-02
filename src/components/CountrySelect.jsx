import React from 'react';
import useAsync from '../hooks/useAsync';
import { getCountries } from '../api';
import SelectItem from './BeneficiaryAddForm/SelectItem';

const filterCountry = (inputValue, option) => {
  return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
};

const CountrySelect = ({
  label = 'Country',
  id = 'country',
  form,
  initialValue,
  ...selectProps
}) => {
  const [countries] = useAsync(getCountries);
  const options = countries
    ? countries.map(c => ({ value: c.iso2, title: c.name }))
    : [];
  const loading = !countries || countries.length === 0;
  return (
    <SelectItem
      label={label}
      id={id}
      required
      showSearch
      filterOption={filterCountry}
      options={options}
      loading={loading}
      form={form}
      initialValue={initialValue}
      {...selectProps}
    />
  );
};

export default CountrySelect;
