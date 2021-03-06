// @ts-check

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { groupBy, uniqBy, flow, uniq } from 'lodash';
import PropTypes from 'prop-types';
import { Anchor, Divider, Radio, Select, Spin, Tabs, Empty } from 'antd';

import TransactionDetails from './TransactionDetails/TransactionDetails';
import TransactionCard from './TransactionCard';
import { fetchList } from '../../redux/actions';
import styles from './Transactions.module.css';
import { formatISODate } from '../../util';
import { MONTHS } from '../../constants';
import { format } from 'date-fns';
import TopTitle from '../TopTitle';

const { Link } = Anchor;
const { Option } = Select;

export const COLORS = {
  DEPOSIT: 'rgba(50, 105, 50, 0.4)',
  WITHDRAWAL: 'rgba(255, 99, 71, 0.4)',
  TRANSFER: '#28aaeb',
};
export const TRANS_ICONS = {
  DEPOSIT: 'rise',
  WITHDRAWAL: 'fall',
  TRANSFER: 'fall',
};
const { TabPane } = Tabs;

export const MONTHS_LENGTH = [31, 28, 30, 31, 30, 31, 30, 31, 30, 31, 30, 31];
export const LINKED_ACC_TYPES = {
  DEPOSIT: 'sender',
  WITHDRAWAL: 'receiver',
  PURCHASE: 'purchase',
};

const TRANSACTION_DIRECTIONS = [
  { name: 'ALL', label: 'All' },
  { name: 'DEPOSIT', label: 'Deposit' },
  { name: 'WITHDRAWAL', label: 'Withdrawal' },
];

const Transactions = ({ transList = [], fetchList }) => {
  //  Fetching full list of transactions
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchList();
      setLoading(false);
    };
    fetch();
  }, []);

  const [filteredTransactions, setFilteredTransactions] = useState(transList);
  useEffect(() => {
    setFilteredTransactions(transList);
    // getLinkedAccounts();
  }, [transList]);

  const getCounteragents = () => {
    const allLinkedAccs = transList.map(t => ({
      id: t.linked_account.id,
      name: t.linked_account.name,
    }));

    const uniqueAccs = uniqBy(allLinkedAccs, 'id');
    return uniqueAccs;
  };

  const counteragents = getCounteragents();
  const [selectedCounteragents, setSelectedCounteragents] = useState(
    new Set([])
  );
  const filterBySelectedCounteragents = transactions => {
    if (!selectedCounteragents.size) {
      return transactions;
    }
    return transactions.filter(transaction =>
      selectedCounteragents.has(transaction.linked_account.id.toString())
    );
  };

  const defaultDirection = TRANSACTION_DIRECTIONS[0].name;
  const [directionFilter, setDirectionFilter] = useState(defaultDirection);
  const filterByDirection = transactions => {
    if (directionFilter === 'ALL') {
      return transactions;
    }
    const filteredList = transactions.filter(
      transaction => transaction.type === directionFilter
    );

    return filteredList;
  };

  const yearFormat = 'y';
  const currentYear = format(Date.now(), yearFormat);
  const getTransactionYear = transaction =>
    formatISODate(transaction.creationDate, yearFormat);
  const availableYears = uniq(
    filteredTransactions.map(getTransactionYear)
  ).reverse();
  const [activeYearTab, setActiveYearTab] = useState(currentYear);
  const filterByYear = transactions =>
    transactions.filter(
      transaction => getTransactionYear(transaction) === activeYearTab
    );

  const monthFormat = 'MMMM';
  const currentMonth = format(Date.now(), monthFormat);
  const getTransactionMonth = transaction =>
    formatISODate(transaction.creationDate, monthFormat);
  const [activeMonthTab, setActiveMonthTab] = useState(currentMonth);
  const filterByMonth = transactions =>
    transactions.filter(
      transaction => getTransactionMonth(transaction) === activeMonthTab
    );

  const dayFormat = 'd';
  const getTransactionDay = transaction =>
    formatISODate(transaction.creationDate, dayFormat);

  const renderYearTabs = () => (
    <Tabs
      activeKey={activeYearTab}
      onTabClick={activeYear => setActiveYearTab(activeYear)}
      size="small"
    >
      {availableYears.map(year => {
        return <TabPane tab={year} key={year} />;
      })}
    </Tabs>
  );

  const renderMonthTabs = () => (
    <Tabs
      activeKey={activeMonthTab}
      onTabClick={activeMonth => setActiveMonthTab(activeMonth)}
      size="small"
      tabBarGutter={15}
    >
      {MONTHS.map(month => {
        return <TabPane tab={month} key={month}></TabPane>;
      })}
    </Tabs>
  );

  const renderAnchorLink = (day, month) => {
    const href = `#${day}-${month}`;
    return <Link key={href} href={href} title={day} />;
  };

  const renderAnchors = days => {
    return (
      <Anchor
        offsetTop={15}
        style={{ position: 'absolute', margin: '15px 0 0 0' }}
        getContainer={() => document.getElementById('transactions')}
      >
        {days.map(day => {
          return renderAnchorLink(day, activeMonthTab);
        })}
      </Anchor>
    );
  };

  const [modalShown, setModalShown] = useState(false);
  const [modalData, setModalData] = useState();

  const showTransactionDetails = record => {
    setModalData(
      filteredTransactions.find(transaction => transaction.id === record.id)
    );
    setModalShown(true);
  };

  const renderMonthTransactions = ([day, transactions], month) => {
    return (
      <div key={day} style={{ alignContent: 'center' }} id={`${day}-${month}`}>
        <Divider className={styles.divider}>
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

  const renderTransactionsContainer = transactions => {
    if (!transactions.length) {
      return <Empty />;
    }
    const groupedByDay = groupBy(transactions, getTransactionDay);
    const availableDays = Object.keys(groupedByDay).reverse();
    const transactionsByDayEntries = Object.entries(groupedByDay).reverse();
    
    return (
      <div id="transactions">
        {renderAnchors(availableDays)}
        {transactionsByDayEntries.map(entry =>
          renderMonthTransactions(entry, activeMonthTab)
        )}
      </div>
    );
  };

  const renderTransactions = flow([
    filterByYear,
    filterByMonth,
    filterByDirection,
    filterBySelectedCounteragents,
    renderTransactionsContainer,
  ]);

  const handleDirectionFilterChange = ({ target }) => {
    const newType = target.value;
    setDirectionFilter(newType);
  };

  const handleCounteragentFilterChange = selectedIdList => {
    const selectedIdSet = new Set(selectedIdList);
    setSelectedCounteragents(selectedIdSet);
  };

  return (
    <>
      <TopTitle title="Transactions" backButton={false} />
      <div
        style={{
          padding: '10px',
          margin: 'auto',
          // maxWidth: '550px',
          textAlign: 'center',
        }}
      >
        <Spin spinning={loading} size="large" tip="loading transactions...">
          <Radio.Group
            defaultValue={defaultDirection}
            onChange={handleDirectionFilterChange}
          >
            {TRANSACTION_DIRECTIONS.map(direction => (
              <Radio.Button value={direction.name} key={direction.name}>
                {direction.label}
              </Radio.Button>
            ))}
          </Radio.Group>
          <br />
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select counteragents"
            // defaultValue={[]}
            onChange={handleCounteragentFilterChange}
            allowClear
          >
            {counteragents.map(account => (
              <Option key={account.id}>{account.name}</Option>
            ))}
          </Select>

          {renderYearTabs()}
          {renderMonthTabs()}
          {renderTransactions(filteredTransactions)}
        </Spin>
      </div>
      <TransactionDetails
        modalShown={modalShown}
        modalData={modalData}
        toggleModal={setModalShown}
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
