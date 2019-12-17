import {
  Button,
  Card as UiCard,
  Col,
  Collapse,
  Descriptions,
  List,
  Modal,
  Row
} from 'antd';
import { startCase } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
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

const Account = ({ account }) => {
  const user = useSelector(({ user }) => user);
  const { first_name, last_name } = user;
  const name = first_name && last_name && `${first_name} ${last_name}`;

  const { number, amount, currency_info, id, bank_deposit } = account;
  const { modalProps, show } = useModal({
    defaultVisible: false
  });
  return (
    <List.Item key={id}>
      <UiCard title="Account" bodyStyle={{ paddingBottom: '10px' }}>
        <div className={styles.name}>{name}</div>
        <Row className={styles.row}>
          <Col span={8} className={styles.infoParam}>
            Number: <div className={'param-value'}>{number}</div>
          </Col>
          <Col span={8} className={styles.infoParam}>
            Balance: <div className={'param-value'}>S${amount}</div>
          </Col>
          <Col span={8} className={styles.infoParam}>
            Currency: <div className={'param-value'}>{currency_info.code}</div>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={8}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'row'
              }}
            >
              <Button type="primary">
                <Link to="/new-payment">Make Payment</Link>
              </Button>
              <Button type="primary" onClick={() => show()}>
                Account Details
              </Button>
              <Modal title="Account details" footer={null} {...modalProps}>
                <Descriptions bordered column={2} layout="vertical">
                  {renderFields(bank_deposit)}
                </Descriptions>
              </Modal>
            </div>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={24}>
            <Collapse expandIconPosition="right">
              <Collapse.Panel
                header="Last transactions"
                className={styles.panel}
              >
                <LastTransactions />
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </UiCard>
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
    transactions: PropTypes.object
  }).isRequired
};

export default Account;
