import { Button, List } from 'antd';
import React from 'react';
import {
  deleteBeneficiary,
  getBeneficiary,
  updateBeneficiary,
} from '../../api';
import BeneficiaryCard from '../../components/BeneficiaryCard';
import useAsync from '../../hooks/useAsync';
import TopTitle from '../../components/TopTitle';

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
      <TopTitle title="Beneficiaries" backButton={false}>
        <Button onClick={handleAddClick} type="primary" icon="user-add">
          Add
        </Button>
      </TopTitle>
      <div className="page-content-wrapper">
        <List
          loading={loading}
          dataSource={loading ? [] : beneficiaries}
          renderItem={renderBeneficiary}
          grid={{
            gutter: [32, 16],
            xs: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 3,
          }}
        />
      </div>
    </>
  );
};

export default Beneficiaries;
