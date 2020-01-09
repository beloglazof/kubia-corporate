import React from 'react';
import useAsync from '../hooks/useAsync';
import { getCountries } from '../api';
import SelectItem from './SelectItem';
import PropTypes from 'prop-types';
import { uniq, difference } from 'lodash';

const filterCountry = (inputValue, option) => {
  return option.props.children.toLowerCase().includes(inputValue.toLowerCase());
};

const CountrySelect = ({
  form,
  initialValue,
  label = 'Country',
  id = 'country',
  disabled = false,
}) => {
  const [countries] = useAsync(getCountries);

  if (!countries) {
    return (
      <SelectItem
        form={form}
        id={id}
        label={label}
        options={[]}
        selectProps={{ loading: true }}
      />
    );
  }

  const countryToOption = c => ({ value: c.iso2.toUpperCase(), title: c.name });
  const options = countries.map(countryToOption);

  const selectProps = {
    showSearch: true,
    filterOption: filterCountry,
    disabled,
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
  initialValue: PropTypes.string,
  disabled: PropTypes.bool,
};

export default CountrySelect;
