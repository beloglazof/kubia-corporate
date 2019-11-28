import useAsync from '../hooks/useAsync';
import { getCurrencies } from '../api';
import SelectItem from './BeneficiaryAddForm/SelectItem';
import React from 'react';

const CurrencySelect = ({ form }) => {
  const currencies = useAsync(getCurrencies);
  const options = currencies
    ? currencies.map(c => ({ value: c.code, title: c.name }))
    : [];
  const loading = !currencies || currencies.length === 0;
  return (
    <SelectItem
      label="Currency"
      id="currency"
      options={options}
      loading={loading}
      form={form}
      required
    />
  );
};

export default CurrencySelect;
