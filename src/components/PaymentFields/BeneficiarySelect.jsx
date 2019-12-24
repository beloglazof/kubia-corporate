import React from 'react';
import { Icon } from 'antd';
import SelectItem from '../SelectItem';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const BeneficiarySelect = ({ form, beneficiaries }) => {
  const options = beneficiaries
    .filter(counterparty => counterparty.bankAccount)
    .map(beneficiary => {
      const { nickname, bankAccount, id, companyName } = beneficiary;

      const title = `${nickname || ''} ${companyName ||
        ''} ${bankAccount.accountNumber || ''}`;
      const option = {
        value: id,
        title,
      };

      return option;
    });
  let history = useHistory();
  const dropdownRender = menu => (
    <div>
      <div
        className="hoverable"
        style={{
          padding: '4px 8px 6px',
          cursor: 'pointer',
          borderBottom: '1px solid rgba(224, 224, 224, 0.25)',
        }}
        onMouseDown={e => e.preventDefault()}
        onClick={() => history.push('/beneficiaries/add')}
      >
        <Icon type="plus" /> Add beneficiary
      </div>
      {menu}
    </div>
  );

  const selectProps = {
    placeholder: 'Select beneficiary',
    dropdownRender,
  };

  return (
    <SelectItem
      form={form}
      label="Beneficiary"
      id="beneficiaryId"
      options={options}
      required
      selectProps={selectProps}
    />
  );
};

BeneficiarySelect.propTypes = {
  form: PropTypes.object.isRequired,
};

export default BeneficiarySelect;
