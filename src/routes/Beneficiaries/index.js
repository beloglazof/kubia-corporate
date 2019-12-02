import React, { useEffect, useState } from 'react';
import { Button, List } from 'antd';
import {
  deleteBeneficiary,
  getBeneficiary,
  updateBeneficiary
} from '../../api';
import BeneficiaryCard from '../../components/BeneficiaryCard';
import useAsync from '../../hooks/useAsync';

const Beneficiaries = ({ history }) => {
  const handleAddClick = () => {
    history.push('beneficiaries/add');
  };

  const [beneficiaries, setBeneficiaries] = useAsync(getBeneficiary);
  

  const handleDelete = beneficiaryId => async () => {
    const deleted = await deleteBeneficiary(beneficiaryId);
    if (deleted) {
      setBeneficiaries(
        beneficiaries.filter(beneficiary => beneficiary.id !== beneficiaryId)
      );
    }
  };

  const handleEdit = beneficiaryId => async newBeneficiary => {
    const updated = await updateBeneficiary(beneficiaryId, newBeneficiary);
    if (updated) {
      setBeneficiaries(
        beneficiaries.map(beneficiary =>
          beneficiary.id === beneficiaryId
            ? { ...beneficiary, ...newBeneficiary }
            : beneficiary
        )
      );
    }
  };

  const loading = !beneficiaries;
  const renderBeneficiary = beneficiary => {
    return (
      <List.Item key={beneficiary.id}>
        <BeneficiaryCard
          beneficiary={beneficiary}
          onDelete={handleDelete(beneficiary.id)}
          onEdit={handleEdit(beneficiary.id)}
        />
      </List.Item>
    );
  };

  return (
    <>
      <h1>Beneficiaries</h1>
      <Button onClick={handleAddClick} type="primary">
        Add
      </Button>
      <List
        loading={loading}
        dataSource={beneficiaries}
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
