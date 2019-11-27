import React from 'react';
import { Button, List } from 'antd';
import { getBeneficiary } from '../../api';
import BeneficiaryCard from '../../components/BeneficiaryCard';
import useAsync from '../../hooks/useAsync';

const Beneficiaries = ({ history }) => {
  const handleAddClick = () => {
    history.push('beneficiaries/add');
  };

  const beneficiaries = useAsync(getBeneficiary);
  const dataSource = beneficiaries ? beneficiaries : [];
  const loading = !beneficiaries;

  return (
    <>
      <h1>Beneficiaries</h1>
      <Button onClick={handleAddClick} type="primary">
        Add
      </Button>
      <List
        loading={loading}
        dataSource={dataSource}
        renderItem={renderBeneficiary}
        grid={{
          gutter: 16,
          xs: 1,
          md: 2,
          lg: 3
        }}
      />
    </>
  );
};

export default Beneficiaries;

const renderBeneficiary = beneficiary => {
  return (
    <List.Item key={beneficiary.id}>
      <BeneficiaryCard beneficiary={beneficiary} />
    </List.Item>
  );
};
