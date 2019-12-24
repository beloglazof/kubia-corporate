import React from 'react';
import PropTypes from 'prop-types';
import SelectItem from '../SelectItem';

const FundingSourceSelect = ({ form, sources = [] }) => {
  const options = sources.map(purpose => ({
    value: purpose.name,
    title: purpose.description,
  }));
  return (
    <SelectItem
      form={form}
      label="Funding source"
      id="fundingSource"
      placeholder="Select funding source"
      options={options}
      required
    />
  );
};

FundingSourceSelect.propTypes = {
  form: PropTypes.object.isRequired,
  sources: PropTypes.array.isRequired,
};

export default FundingSourceSelect;
