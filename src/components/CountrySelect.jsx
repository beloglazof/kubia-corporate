import React from 'react';
import useAsync from '../hooks/useAsync';
import { getCountries } from '../api';
import SelectItem from './SelectItem';
import PropTypes from 'prop-types';

const filterCountry = (inputValue, option) => {
  return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
};

const CountrySelect = ({
  label = 'Country',
  id = 'country',
  form,
  initialValue
}) => {
  const [countries] = useAsync(getCountries);
  const options = countries
    ? countries.map(c => ({ value: c.iso2, title: c.name }))
    : [];
  const loading = !countries || countries.length === 0;
  const selectProps = {
    showSearch: true,
    filterOption: filterCountry,
    loading
  };
  return (
    <SelectItem
      form={form}
      label={label}
      id={id}
      options={options}
      initialValue={initialValue}
      required
      selectProps={selectProps}
    />
  );
};

CountrySelect.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  form: PropTypes.object.isRequired,
  initialValue: PropTypes.string
};

export default CountrySelect;
