import React from 'react';
import SelectItem from '../SelectItem';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const AccountSelect = ({ accounts, form }) => {
  let location = useLocation();
  const fromAccountId = location.state?.accountId;
  const options = accounts.map(account => {
    const { number, amount, currency_info } = account;
    const { symbol } = currency_info;
    const title = `${number} | Balance: ${symbol} ${amount}`;
    return {
      title,
      value: account.id,
    };
  });
  const selectProps = {
    placeholder: 'Select account',
  };
  return (
    <SelectItem
      form={form}
      label="Account"
      id="accountId"
      options={options}
      required
      selectProps={selectProps}
      initialValue={fromAccountId}
    />
  );
};

AccountSelect.propType = {
  accounts: PropTypes.array.isRequired,
  form: PropTypes.object.isRequired,
};

export default AccountSelect;
