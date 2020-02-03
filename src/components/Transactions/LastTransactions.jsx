import { Table, Button } from 'antd';
import { take } from 'lodash';
import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../api';
import useAsync from '../../hooks/useAsync';
import {
  singaporeDateTimeFormat,
  singaporeDateFormat,
} from '../../util/config';
import { formatISODate } from '../../util/index.js';
import { useHistory } from 'react-router-dom';

import { LINKED_ACC_TYPES, COLORS } from './index';
import TransactionDetails from './TransactionDetails/TransactionDetails';
import { TransactionAmount } from './TransactionCard';
const lastTransactionsNumber = 5;

const LastTransactions = ({ data }) => {
  // const [transactionsResponse] = useAsync(getTransactions);
  const [lastTransactions, setLastTransactions] = useState([]);
  useEffect(() => {
    if (data) {
      const transactions = data.results;
      const last = take(transactions, lastTransactionsNumber);
      setLastTransactions(last);
    }
  }, [data]);

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState();

  const showTransactionDetails = record => {
    setModalData(
      lastTransactions.find(transaction => transaction.id === record.id)
    );
    setModalShown(true);
  };

  const renderAmount = (amount, transaction) => {
    const { currency, type: direction } = transaction;
    return (
      <TransactionAmount
        amount={amount}
        currency={currency}
        transactionDirection={direction}
      />
    );
  };

  const renderFromField = (linkedAccount, transaction) => {
    const linkedAccType = LINKED_ACC_TYPES[transaction.type];

    if (transaction.details) {
      return transaction.details[linkedAccType].name;
    }
    const name = linkedAccount.name;
    return name;
  };

  const renderDate = date => {
    const formattedDate = formatISODate(date, singaporeDateFormat.long);

    return formattedDate;
  };
  const isLoading = !data;
  const { Column } = Table;
  const history = useHistory();
  const handleMoreClick = () => {
    history.push('/transactions');
  };
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={lastTransactions}
        rowKey="id"
        size="small"
        pagination={false}
        onRowClick={showTransactionDetails}
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
          ellipsis
        />

        <Column
          title="From/To"
          dataIndex="linked_account"
          key="linkedAccount"
          render={renderFromField}
        />
        <Column title="Type" dataIndex="details.type" key="type" />
      </Table>
      <TransactionDetails
        modalShown={modalShown}
        modalData={modalData}
        toggleModal={setModalShown}
      />
      <div style={{ display: 'flex' }}>
        <Button
          style={{ marginTop: '1em', marginLeft: 'auto', width: '20%' }}
          onClick={handleMoreClick}
        >
          More
        </Button>
      </div>
    </>
  );
};

export default LastTransactions;
