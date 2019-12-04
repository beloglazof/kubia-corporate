import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { groupBy, mapValues } from 'lodash';

import {
  Anchor,
  BackTop,
  Card,
  Divider,
  Icon,
  Radio,
  Select,
  Spin,
  Tabs,
  Tooltip
} from 'antd';
import TransactionDetails from './TransactionDetails/TransactionDetails';
import { fetchList } from '../../redux/actions';
import styles from './Transactions.module.css';
import { formatISODate } from '../../util';

const { Link } = Anchor;
const { Option } = Select;

export const COLORS = {
  DEPOSIT: 'limegreen',
  WITHDRAWAL: 'tomato',
  TRANSFER: '#28aaeb'
};
export const TRANS_ICONS = {
  DEPOSIT: 'rise',
  WITHDRAWAL: 'fall'
};
const { TabPane } = Tabs;
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const MONTHS_LENGTH = [31, 28, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31];
export const LINKED_ACC_TYPES = {
  DEPOSIT: 'Sender',
  WITHDRAWAL: 'Recipient'
};

//  Currency with tooltip
const currencyTooltip = currency => (
  <Tooltip title={currency?.name}>
    <span>{currency?.symbol}</span>
  </Tooltip>
);

//  Amount styled with tooltip
const amountTooltip = amount => (
  <Tooltip title="Amount">
    <span>{amount}</span>
  </Tooltip>
);

const TransactionCard = ({ transaction, handleClick }) => {
  return (
    <Card
      key={transaction.id}
      size="small"
      title={
        <span>
          {currencyTooltip(transaction.currency)}{' '}
          {amountTooltip(transaction.amount)}
        </span>
      }
      extra={
        <span style={{ color: COLORS[transaction.type] }}>
          {transaction.type}
        </span>
      }
      hoverable
      style={{ margin: 'auto auto 10px', width: '350px' }}
      headStyle={{ textAlign: 'left' }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center'
      }}
      onClick={() => handleClick(transaction)}
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
  );
};

const Transactions = ({ transList, fetchList }) => {
  //  Fetching full list of transactions
  useEffect(() => {
    fetchList();
  }, []);

  const [filters, updateFilters] = useState({
    //  Filters stored here
    type: 'ALL',
    linkedAccounts: []
  });
  const [filteredTransactions, setFilteredTransactions] = useState(transList); //  Filtered list of transactions
  useEffect(() => {
    setFilteredTransactions(transList);
    linkedAccounts();
  }, [transList]);

  const [modalShown, toggleModal] = useState(false); //  Modal state
  const [modalData, fillModal] = useState(''); // Modal content state
  // Transaction type colors

  //  Transaction details modal toggler
  const handleClick = record => {
    fillModal(
      filteredTransactions.find(transaction => transaction.id === record.id)
    );
    toggleModal(true);
  };

  //  Get each month's transactions
  const monthlyTransactions = monthNum =>
    filteredTransactions.filter(
      t => new Date(t.creationDate).getMonth() === monthNum
    );

  // Get each day's transactions
  const dailyTransactions = (transactions, day) =>
    transactions.filter(t => new Date(t.creationDate).getDate() === day);

  //  Return daily grouped transactions
  const transactionsOfADay = monthInd => {
    const group = [];
    for (let i = 0; i <= MONTHS_LENGTH[monthInd]; i++) {
      if (dailyTransactions(monthlyTransactions(monthInd), i).length) {
        group.push(
          <div key={i} style={{ alignContent: 'center' }}>
            <Divider
              // style={{ margin: '10px auto' }}
              id={`${i}-${MONTHS[monthInd]}`}
              className={styles.divider}
            >
              {i} {MONTHS[monthInd]}
            </Divider>
            {dailyTransactions(monthlyTransactions(monthInd), i).map(t => (
              <TransactionCard handleClick={handleClick} transaction={t} />
            ))}
            <BackTop />
          </div>
        );
      }
    }
    return group;
  };

  const transactionsGroupedByMonth = groupBy(
    filteredTransactions,
    transaction => formatISODate(transaction.creationDate, 'MMMM')
  );

  const transactionsGroupedByMonthAndDay = mapValues(
    transactionsGroupedByMonth,
    monthTransactions =>
      groupBy(monthTransactions, transaction =>
        formatISODate(transaction.creationDate, 'd')
      )
  );

  //  Building anchors
  const anchorBuilder = monthNum => {
    const anchors = [];
    for (let i = 1; i <= MONTHS_LENGTH[monthNum]; i++) {
      if (dailyTransactions(monthlyTransactions(monthNum), i).length) {
        anchors.push(
          <Link
            key={`#${i}-${MONTHS[monthNum]}`}
            href={`#${i}-${MONTHS[monthNum]}`}
            title={i}
          />
        );
      }
    }
    return anchors;
  };

  //  Handle transaction type filter
  const handleFilter = e => {
    let newData = [];
    let dataToProcess = [];
    let filter = '';
    if (e.target) {
      filter = e.target.value;
    } else {
      filter = e;
    }
    if (filter === 'DEPOSIT' || filter === 'WITHDRAWAL' || filter === 'ALL') {
      updateFilters({
        ...filters,
        type: filter
      });
      if (filters.linkedAccounts.length) {
        //  Linked account refiltering
        filters.linkedAccounts.map(f =>
          transList
            .filter(t => t.linked_account.id.toString() === f)
            .map(t => newData.push(t))
        );
        dataToProcess = newData;
      } else {
        dataToProcess = transList;
      }
    } else {
      updateFilters({ linkedAccounts: filter });
      //  Linked account filtering
      filter.map(f =>
        transList
          .filter(t => t.linked_account.id.toString() === f)
          .map(t => newData.push(t))
      );
      if (filter.length) {
        dataToProcess = newData;
      } else {
        dataToProcess = transList;
      }
    }
    //  Type filtering
    switch (filter) {
      case 'DEPOSIT': {
        newData = dataToProcess.filter(t => t.type === filter);
        break;
      }
      case 'WITHDRAWAL': {
        newData = dataToProcess.filter(t => t.type === filter);
        break;
      }
      default: {
        newData = dataToProcess;
        break;
      }
    }
    setFilteredTransactions(newData);
  };

  //  Map all linked accounts
  const linkedAccounts = () => {
    const accs = transList.map(t => ({
      id: t.linked_account.id,
      name: t.linked_account.name
    }));
    const uniqueAccs = accs
      .map(e => e['id'])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter(e => accs[e])
      .map(e => accs[e]);
    return uniqueAccs.map(acc => <Option key={acc.id}>{acc.name}</Option>);
  };

  const renderMonthTransactions = ([day, transactions], month) => {
    return (
      <div key={day} style={{ alignContent: 'center' }}>
        <Divider
          id={`${day}-${month}`}
          className={styles.divider}
        >
          {day} {month}
        </Divider>
        {transactions.map(t => (
          <TransactionCard handleClick={handleClick} transaction={t} />
        ))}
        <BackTop />
      </div>
    );
  };

  const renderMonthTabPane = ([month, monthTransactions]) => {
    const monthInd = MONTHS.indexOf(month);
    return (
      <TabPane tab={month} key={month}>
        <Anchor
          offsetTop={15}
          style={{ position: 'absolute', margin: '15px 0 0 0' }}
          getContainer={() =>
            document.getElementsByClassName('ant-tabs-content')[0]
          }
        >
          {anchorBuilder(monthInd)}
        </Anchor>
        {Object.entries(monthTransactions).map(v =>
          renderMonthTransactions(v, month)
        )}
        {/* {transactionsOfADay(monthInd)} */}
      </TabPane>
    );
  };

  const renderTransactions = transactions => {
    return Object.entries(transactions).map(renderMonthTabPane).reverse();
  };

  return (
    <>
      <div
        style={{
          padding: '10px',
          margin: 'auto',
          maxWidth: '550px',
          textAlign: 'center'
        }}
      >
        <Spin spinning={!transList} size="large" tip="loading transactions...">
          <Radio.Group defaultValue="ALL" onChange={handleFilter}>
            <Radio.Button value="ALL">All</Radio.Button>
            <Radio.Button value="DEPOSIT">Deposit</Radio.Button>
            <Radio.Button value="WITHDRAWAL">Withdrawal</Radio.Button>
          </Radio.Group>
          <br />
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select recipient(s)/reciever(s)"
            onChange={handleFilter}
            allowClear
          >
            {linkedAccounts()}
          </Select>
          <Tabs
            defaultActiveKey={MONTHS[new Date().getMonth().toString()]}
            size="small"
            tabBarGutter={15}
            // tabBarStyle={{ margin: '0' }}
            animated={false}
            /* onChange={(activeKey) => handleFilter(activeKey)} */
          >
            {renderTransactions(transactionsGroupedByMonthAndDay)}
          </Tabs>
        </Spin>
      </div>
      <TransactionDetails
        modalShown={modalShown}
        modalData={modalData}
        toggleModal={toggleModal}
        COLORS={COLORS}
        TRANS_ICONS={TRANS_ICONS}
        LINKED_ACC_TYPES={LINKED_ACC_TYPES}
      />
    </>
  );
};

// Mapping store state to component props
const mapStateToProps = state => ({
  transList: state.transactions.transList
});

//  Mapping store actions to component props
const mapDispatchToProps = dispatch => ({
  fetchList: () => dispatch(fetchList())
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
