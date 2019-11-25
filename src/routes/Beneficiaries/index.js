import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, List } from 'antd';
import CounterpartyAddForm from '../../components/BeneficiaryAddForm';
import { getBeneficiary } from '../../api';
import { startCase } from 'lodash';

const Beneficiaries = ({ history }) => {
  const handleAddClick = () => {
    history.push('beneficiaries/add');
  };

  const [beneficiaries, setBeneficiaries] = useState([]);
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      const fetchedCounterparties = await getBeneficiary();
      if (fetchedCounterparties) {
        const filtered = fetchedCounterparties.filter(
          counterparty => counterparty.accountNumber
        );
        setBeneficiaries(filtered);
      }
    };
    fetchBeneficiaries();
  }, []);

  const renderBeneficiary = beneficiary => {
    return (
      <List.Item>
        <BeneficiaryCard beneficiary={beneficiary} />
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

const BeneficiaryCard = ({ beneficiary }) => {
  const visibleFields = new Set([
    'accountNumber',
    'companyName',
    'email',
    'firstName',
    'lastName',
    'country'
  ]);
  const renderInfo = info => {
    return Object.entries(info)
      .filter(([name]) => visibleFields.has(name))
      .map(([name, value]) => {
        const label = startCase(name);
        const span = name === 'email' ? 2 : 1
        return <Descriptions.Item span={span} label={label}>{value}</Descriptions.Item>;
      });
  };
  const cardTitle = startCase(beneficiary?.nickname) || null;

  const editBeneficiary = () => {};
  const beneficiaryDetails = () => {};
  const deleteBeneficiary = () => {};

  const cardActions = [
    { name: 'edit', handler: editBeneficiary, icon: 'edit' },
    { name: 'details', handler: beneficiaryDetails, icon: 'profile' },
    { name: 'delete', handler: deleteBeneficiary, icon: 'delete' }
  ].map(({ name, handler, icon }) => {
    return (
      <Button type="primary" icon={icon} onClick={handler}>
        {startCase(name)}
      </Button>
    );
  });
  return (
    <Card
      title={cardTitle}
      headStyle={{ fontSize: '1.5em' }}
      size={'small'}
      actions={cardActions}
    >
      <Descriptions bordered column={2} layout="vertical">
        {renderInfo(beneficiary)}
      </Descriptions>
    </Card>
  );
};

export default Beneficiaries;
