import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, List } from 'antd';
import CounterpartyAddForm from '../../components/CounterpartyAddForm';
import { getBeneficiary } from '../../api';
import { startCase } from 'lodash';

// TODO rename counterparty to beneficiary
const Counterparties = ({ history }) => {
  const handleAddClick = () => {
    history.push('counterparties/add');
  };

  const [counterparties, setCounterparties] = useState([]);
  useEffect(() => {
    const fetchCounterparties = async () => {
      const fetchedCounterparties = await getBeneficiary();
      if (fetchedCounterparties) {
        const filtered = fetchedCounterparties.filter(
          counterparty => counterparty.accountNumber
        );
        console.log(filtered);
        setCounterparties(filtered);
      }
    };
    fetchCounterparties();
  }, []);

  const renderCounterparty = counterparty => {
    return (
      <List.Item>
        <CounterpartyCard counterparty={counterparty} />
      </List.Item>
    );
  };
  return (
    <>
      <h1>Beneficiaries</h1>
      <Button onClick={handleAddClick} type="primary">
        Add
      </Button>
      <List dataSource={counterparties} renderItem={renderCounterparty} />
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

export default Counterparties;
