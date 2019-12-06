import { Button, Card, Icon, List, Tooltip, Table } from 'antd';
import { take } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api';
import useAsync from '../../hooks/useAsync';
import { formatISODate } from '../../util/index.js';
import { COLORS, LINKED_ACC_TYPES, TRANS_ICONS } from './index.js';
import { useHistory } from 'react-router-dom';
import { singaporeDateTimeFormat } from '../../util/config';

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

const LastTransactions = () => {
  const [transactionsResponse] = useAsync(getTransactions);
  const [lastTransactions, setLastTransactions] = useState([]);
  useEffect(() => {
    if (transactionsResponse) {
      const transactions = transactionsResponse.results;
      const last = take(transactions, lastTransactionsNumber);
      setLastTransactions(last);
    }
  }, [transactionsResponse]);

  const renderAmount = (amount, record) => {
    const currency = record.currency.symbol;
    const amountWithCurrency = `${currency} ${amount}`;
    return amountWithCurrency;
  };

  const renderFromField = linkedAccount => {
    const name = linkedAccount.name;
    return name;
  };

  const renderDate = (date, record) => {
    const formattedDate = formatISODate(date, singaporeDateTimeFormat.medium);
    return formattedDate;
  };
  const isLoading = !lastTransactions.length;
  const { Column } = Table;
  return (
    <Table
      loading={isLoading}
      dataSource={lastTransactions}
      rowKey="id"
      size="small"
      bordered
    >
      <Column
        title="Amount"
        dataIndex="amount"
        key="amount"
        render={renderAmount}
      />
      <Column
        title="Creation date"
        dataIndex="creationDate"
        key="creationDate"
        render={renderDate}
      />

      <Column
        title="From"
        dataIndex="linked_account"
        key="linkedAccount"
        render={renderFromField}
      />
      <Column title="Type" dataIndex="type" key="type" />
    </Table>
  );
};

export default LastTransactions;
