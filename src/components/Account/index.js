import {
  Button,
  Card,
  Col,
  Collapse,
  Descriptions,
  List,
  Modal,
  Row,
} from 'antd';
import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useModal } from 'sunflower-antd';
import LastTransactions from '../Transactions/LastTransactions';
import styles from './account.module.css';

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

const AccountCardHeader = ({ number, amount, currencyInfo }) => (
  <Row
    style={{ marginBottom: '.4em' }}
    gutter={[16, 16]}
  >
    <Col xs={24}>
      <div>
        <span
          className={'param-value'}
          style={{
            fontSize: 'calc(16px + 0.5vw)',
            lineHeight: 'calc(16px + 1.05vw)',
          }}
        >
          {currencyInfo.code} Account &nbsp;
          {number}
        </span>
      </div>
    </Col>
    <Col xs={24}>
      <div
        style={{
          textAlign: 'left',
        }}
      >
        <span
          style={{
            letterSpacing: '-.02em',
            fontWeight: 'bold',
            fontSize: 'calc(14px + 0.5vw)',
            lineHeight: 'calc(16px + 1.05vw)',
          }}
        >
          Current Amount &nbsp;
          {currencyInfo.symbol}
          {Number(amount).toFixed(currencyInfo.units)}
        </span>
      </div>
    </Col>
    <Col xs={24}>
      <Button type="primary" key="payment" block>
        <Link to="/new-payment">Make Payment</Link>
      </Button>
    </Col>

    {/* <Col xs={12}>
            <div>
              Currency:
              <div className={'param-value'}>{currency_info.code}</div>
            </div>
          </Col> */}
  </Row>
);

const Account = ({ account }) => {
  const user = useSelector(({ user }) => user);
  const { first_name, last_name } = user;
  const name = first_name && last_name && `${first_name} ${last_name}`;

  const {
    number,
    amount,
    currency_info,
    id,
    bank_deposit,
    transactions,
  } = account;

  const { modalProps, show } = useModal({
    defaultVisible: false,
  });

  const tabList = [
    { key: 'lastTransactions', tab: 'Last transactions' },
    { key: 'accountDetails', tab: 'Account Details' },
  ];
  const defaulActiveTabKey = tabList[0].key;
  const [activeTabKey, setActiveTabKey] = useState(defaulActiveTabKey);

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
          />
        }
        bodyStyle={{ padding: '16px 18px' }}
        tabList={tabList}
        activeTabKey={activeTabKey}
        onTabChange={key => setActiveTabKey(key)}
      >
        {renderTab(activeTabKey)}
        {/* <div className={styles.name}>{name}</div> */}

        {/* <Row gutter={[16, 16]}>
          <Col span={24}>
            <Collapse expandIconPosition="right">
              <Collapse.Panel
                header="Last transactions"
                className={styles.panel}
              >
                <LastTransactions data={transactions} />
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row> */}
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
    updated: PropTypes.string,
    bank_deposit: PropTypes.object,
    cards: PropTypes.array,
    transactions: PropTypes.object,
  }).isRequired,
};

export default Account;
