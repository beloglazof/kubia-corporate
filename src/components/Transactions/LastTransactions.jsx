import { Table } from 'antd';
import { take } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api';
import useAsync from '../../hooks/useAsync';
import { singaporeDateTimeFormat } from '../../util/config';
import { formatISODate } from '../../util/index.js';

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
      pagination={false}
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
        title="From/To"
        dataIndex="linked_account"
        key="linkedAccount"
        render={renderFromField}
      />
      <Column title="Type" dataIndex="type" key="type" />
    </Table>
  );
};

export default LastTransactions;
