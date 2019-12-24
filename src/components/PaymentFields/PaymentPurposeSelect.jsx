import React from 'react';
import SelectItem from '../SelectItem';
import InputItem from '../InputItem';
import PropTypes from 'prop-types';

const PaymentPurposeSelect = ({ form, purposes = [] }) => {
  const options = purposes.map(purpose => ({
    value: purpose.name,
    title: purpose.description,
  }));
  const purpose = form.getFieldValue('purposeOfTransfer');
  const showDescriptionField = purpose && purpose.toLowerCase() === 'oth';
  return (
    <>
      <SelectItem
        form={form}
        label="Payment Purpose"
        id="purposeOfTransfer"
        placeholder="Select purpose"
        options={options}
        required
      />
      {showDescriptionField && (
        <InputItem
          form={form}
          label="Purpose Description"
          id="purposeOfTransferDescription"
          placeholder="Input description"
          required
        />
      )}
    </>
  );
};

PaymentPurposeSelect.propTypes = {
  form: PropTypes.object.isRequired,
  purposes: PropTypes.array.isRequired,
};

export default PaymentPurposeSelect;
