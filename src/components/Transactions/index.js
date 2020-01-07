import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { groupBy, mapValues, uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import {
  Anchor,
  Card,
  Divider,
  Icon,
  Radio,
  Select,
  Spin,
  Tabs,
  Tooltip,
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
  TRANSFER: '#28aaeb',
};
export const TRANS_ICONS = {
  DEPOSIT: 'rise',
  WITHDRAWAL: 'fall',
  TRANSFER: 'fall',
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
  'December',
];

export const MONTHS_LENGTH = [31, 28, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31];
export const LINKED_ACC_TYPES = {
  DEPOSIT: 'Sender',
  WITHDRAWAL: 'Recipient',
};

const TRANSACTION_TYPES = [
  { name: 'ALL', label: 'All' },
  { name: 'DEPOSIT', label: 'Deposit' },
  { name: 'WITHDRAWAL', label: 'Withdrawal' },
];

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
      style={{ margin: 'auto auto 10px', width: '50%' }}
      headStyle={{ textAlign: 'left' }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
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

const Transactions = ({ transList = [], fetchList }) => {
  //  Fetching full list of transactions
  useEffect(() => {
    fetchList();
  }, []);

  const [filters, updateFilters] = useState({
    //  Filters stored here
    type: 'ALL',
    linkedAccounts: [],
  });
  const [filteredTransactions, setFilteredTransactions] = useState(transList);
  useEffect(() => {
    setFilteredTransactions(transList);
    getLinkedAccounts();
  }, [transList]);

  const [modalShown, toggleModal] = useState(false);
  const [modalData, fillModal] = useState('');

  const showTransactionDetails = record => {
    fillModal(
      filteredTransactions.find(transaction => transaction.id === record.id)
    );
    toggleModal(true);
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
  const getLinkedAccounts = () => {
    const allLinkedAccs = transList.map(t => ({
      id: t.linked_account.id,
      name: t.linked_account.name,
    }));

    const uniqueAccs = uniqBy(allLinkedAccs, 'id');
    return uniqueAccs;
  };

  const linkedAccounts = getLinkedAccounts();

  const renderMonthTransactions = ([day, transactions], month) => {
    return (
      <div key={day} style={{ alignContent: 'center' }}>
        <Divider id={`${day}-${month}`} className={styles.divider}>
          {day} {month}
        </Divider>
        {transactions.map(t => (
          <TransactionCard
            handleClick={showTransactionDetails}
            transaction={t}
            key={t.id}
          />
        ))}
      </div>
    );
  };

  const renderAnchorLink = (day, month) => {
    const href = `#${day}-${month}`;
    return <Link key={href} href={href} title={day} />;
  };

  const renderMonthTabPane = ([month, monthTransactionsByDay]) => {
    const monthInd = MONTHS.indexOf(month).toString();
    const monthTransactionsByDayEntries = Object.entries(
      monthTransactionsByDay
    );
    return (
      <TabPane tab={month} key={month}>
        <Anchor
          offsetTop={15}
          style={{ position: 'absolute', margin: '15px 0 0 0' }}
          getContainer={() =>
            document.getElementsByClassName('ant-tabs-content')[0]
          }
        >
          {/* {anchorBuilder(monthInd)} */}
          {monthTransactionsByDayEntries.map(([day]) =>
            renderAnchorLink(day, month)
          )}
        </Anchor>
        {monthTransactionsByDayEntries.map(entry =>
          renderMonthTransactions(entry, month)
        )}
        {/* {transactionsOfADay(monthInd)} */}
      </TabPane>
    );
  };

  const renderTransactions = transactions => {
    const transactionsEntries = Object.entries(transactions).reverse();
    return transactionsEntries.map(renderMonthTabPane);
  };

  const [activeKey, setActiveKey] = useState();
  useEffect(() => {
    if (transList.length > 0) {
      const defaultActiveKey = formatISODate(transList[0].creationDate, 'MMMM');
      setActiveKey(defaultActiveKey);
    }
  }, [transList]);

  const defaultType = TRANSACTION_TYPES[0];
  const [transactionTypeFilter, setTransactionTypeFilter] = useState(
    defaultType
  );
  useEffect(() => {
    if (transactionTypeFilter === 'ALL') {
      return setFilteredTransactions(transList);
    }
    const filteredList = transList.filter(
      transaction => transaction.type === transactionTypeFilter
    );
    setFilteredTransactions(filteredList);
  }, [transactionTypeFilter]);
  const handleTypeChange = ({ target }) => {
    const newType = target.value;
    setTransactionTypeFilter(newType);
  };

  return (
    <>
      <div
        style={{
          padding: '10px',
          margin: 'auto',
          // maxWidth: '550px',
          textAlign: 'center',
        }}
      >
        <Spin spinning={!transList} size="large" tip="loading transactions...">
          <Radio.Group defaultValue="ALL" onChange={handleTypeChange}>
            {TRANSACTION_TYPES.map(type => (
              <Radio.Button value={type.name} key={type.name}>
                {type.label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <br />
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select recipient(s)/reciever(s)"
            // defaultValue={[]}
            onChange={handleFilter}
            allowClear
          >
            {linkedAccounts.map(account => (
              <Option key={account.id}>{account.name}</Option>
            ))}
          </Select>
          <Tabs
            activeKey={activeKey}
            size="small"
            tabBarGutter={15}
            animated={false}
            onTabClick={activeKey => setActiveKey(activeKey)}
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

Transactions.propTypes = {
  transList: PropTypes.array.isRequired,
  fetchList: PropTypes.func.isRequired,
};

// Mapping store state to component props
const mapStateToProps = state => ({
  transList: state.transactions.transList,
});

//  Mapping store actions to component props
const mapDispatchToProps = dispatch => ({
  fetchList: () => dispatch(fetchList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
