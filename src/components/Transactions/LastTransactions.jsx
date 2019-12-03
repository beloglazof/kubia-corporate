import { Button, Card, Icon, List, Tooltip } from 'antd';
import { take } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api';
import useAsync from '../../hooks/useAsync';
import { formatISODate } from '../../util/index.js';
import { COLORS, LINKED_ACC_TYPES, TRANS_ICONS } from './index.js';

const currencyTooltip = currency => (
  <Tooltip title={currency.name}>
    <span>{currency.symbol}</span>
  </Tooltip>
);

const amountTooltip = amount => (
  <Tooltip title="Amount">
    <span>{amount}</span>
  </Tooltip>
);

const Transaction = ({ transaction }) => {
  const { creationDate } = transaction;
  const dateTitle = formatISODate(creationDate, 'd MMMM');
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '0.5em' }}>
        {dateTitle}
      </div>
      <Card
        size="small"
        title={
          <span>
            {currencyTooltip(transaction.currency)}
            {amountTooltip(transaction.amount)}
          </span>
        }
        extra={
          <span style={{ color: COLORS[transaction.type] }}>
            {transaction.type}
          </span>
        }
        style={{ margin: 'auto auto 10px', width: '350px' }}
        headStyle={{ textAlign: 'left' }}
        bodyStyle={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Icon
          type={TRANS_ICONS[transaction.type]}
          style={{ color: COLORS[transaction.type] }}
        />
        <Tooltip title="Account number">
          <span style={{ flex: '1' }}>{transaction.account.number}</span>
        </Tooltip>
        <Tooltip title={LINKED_ACC_TYPES[transaction.type]}>
          {transaction.linked_account.name}
        </Tooltip>
      </Card>
    </>
  );
};

const lastTransactionsNumber = 5;

const LastTransactions = ({ history }) => {
  const [transactionsResponse] = useAsync(getTransactions);
  const [lastTransactions, setLastTransactions] = useState([]);
  useEffect(() => {
    if (transactionsResponse) {
      const transactions = transactionsResponse.results;
      const last = take(transactions, lastTransactionsNumber);
      setLastTransactions(last);
    }
  }, [transactionsResponse]);

  const renderTransaction = (transaction, index) => {
    if (!transaction) return null;
    return (
      <List.Item key={transaction.id}>
        <Transaction transaction={transaction} />
      </List.Item>
    );
  };

  const handleMoreClick = () => {
    history.push('/transactions');
  };
  return (
    <List
      footer={
        <Button type="primary" onClick={handleMoreClick} block>
          More
        </Button>
      }
      dataSource={lastTransactions}
      renderItem={renderTransaction}
      split={false}
      itemLayout="vertical"
      size="small"
    />
  );
};

export default LastTransactions;
