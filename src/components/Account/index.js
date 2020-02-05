import {
  Button,
  Card,
  Descriptions,
  List,
} from 'antd';
import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LastTransactions from '../Transactions/LastTransactions';
import useAsync from '../../hooks/useAsync';
import { getTransactions } from '../../api';
import { formatAmount } from '../../util';

const renderField = ([name, value]) => {
  const label = startCase(name);
  return (
    <Descriptions.Item label={label} key={name}>
      <span style={{ fontWeight: 'bold' }}>{value}</span>
    </Descriptions.Item>
  );
};

const renderFields = (fieldsObj = {}) => {
  const fields = Object.entries(fieldsObj);
  const mapped = fields.map(renderField);
  return mapped;
};

const AccountCardHeader = ({ number, amount, currencyInfo, id }) => {
  const formattedAmount = formatAmount(amount);
  return (
    <div>
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Account Number</span>
          <span>{number}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Current Amount</span>
          <span>
            {currencyInfo.symbol}
            {formattedAmount}
          </span>
        </div>
      </div>

      <Button style={{ marginTop: '1em' }} type="primary" key="payment" block>
        <Link to={{ pathname: '/payments/new', state: { fromAccountId: id } }}>
          Make Payment
        </Link>
      </Button>
    </div>
  );
};

const Account = ({ account }) => {
  const {
    number,
    amount,
    currency_info,
    id,
    bank_deposit,
  } = account;

  const tabList = [
    { key: 'lastTransactions', tab: 'Last transactions' },
    { key: 'accountDetails', tab: 'Account Details' },
  ];
  const defaulActiveTabKey = tabList[0].key;
  const [activeTabKey, setActiveTabKey] = useState(defaulActiveTabKey);

  const [transactions] = useAsync(getTransactions, null, [], id, 5);
  const renderTab = tabKey => {
    switch (tabKey) {
      case tabList[0].key:
        return <LastTransactions data={transactions} />;
      case tabList[1].key:
        return (
          <Descriptions column={2} layout="horizontal">
            {renderFields(bank_deposit)}
          </Descriptions>
        );
      default:
        return 'Unknow tab key';
    }
  };

  return (
    <List.Item key={id}>
      <Card
        style={{
          minWidth: '260px',
        }}
        title={
          <AccountCardHeader
            number={number}
            amount={amount}
            currencyInfo={currency_info}
            id={id}
          />
        }
        bodyStyle={{ padding: '16px 18px' }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={key => setActiveTabKey(key)}
      >
        {renderTab(activeTabKey)}
      </Card>
    </List.Item>
  );
};

Account.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    number: PropTypes.string.isRequired,
    currency_info: PropTypes.object,
    amount: PropTypes.number,
    balance: PropTypes.object,
    created: PropTypes.string,
    updated: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    bank_deposit: PropTypes.object,
    cards: PropTypes.array,
    transactions: PropTypes.object,
  }).isRequired,
};

export default Account;
