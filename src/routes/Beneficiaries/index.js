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
        <CounterpartyCard counterparty={beneficiary} />
      </List.Item>
    );
  };
  return (
    <>
      <h1>Beneficiaries</h1>
      <Button onClick={handleAddClick} type="primary">
        Add
      </Button>
      <List dataSource={beneficiaries} renderItem={renderBeneficiary} />
    </>
  );
};

const CounterpartyCard = ({ counterparty }) => {
  const renderInfo = info => {
    return Object.entries(info)
      .filter(([name]) => name !== 'id')
      .map(([name, value]) => {
        const label = startCase(name);
        return <Descriptions.Item label={label}>{value}</Descriptions.Item>;
      });
  };
  return (
    <Card size={'small'}>
      <Descriptions bordered column={2}>{renderInfo(counterparty)}</Descriptions>
    </Card>
  );
};

export default Beneficiaries;
