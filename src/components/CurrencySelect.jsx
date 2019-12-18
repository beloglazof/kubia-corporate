import useAsync from '../hooks/useAsync';
import { getCurrencies, getBeneficiaryCurrencies } from '../api';
import SelectItem from './SelectItem';
import React from 'react';
import PropTypes from 'prop-types';

const CurrencySelect = ({ form, extended = false }) => {
  const request = extended ? getBeneficiaryCurrencies : getCurrencies;
  const [currencies] = useAsync(request, []);
  const options = currencies
    ? currencies.map(c => ({ value: c.code, title: c.name }))
    : [];
  const loading = !currencies || currencies.length === 0;
  const selectProps = {
    loading,
  };
  return (
    <SelectItem
      form={form}
      label="Currency"
      id="currency"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

CurrencySelect.propTypes = {
  form: PropTypes.object.isRequired,
};

export default CurrencySelect;
