import { Button, Card as UiCard, Col, List, Row, Collapse } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import styles from './account.module.css';
import LastTransactions from '../Transactions/LastTransactions';

const Account = ({ account }) => {
  const user = useSelector(({ user }) => user);
  const { first_name, last_name } = user;
  const name = first_name && last_name && `${first_name} ${last_name}`;

  const { number, amount, currency_info, id } = account;

  const history = useHistory();
  const handleMoreClick = () => {
    history.push('/transactions');
  };

  const headerPanelStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };
  return (
    <List.Item key={id}>
      <UiCard title="Account info" bodyStyle={{paddingBottom: '10px'}}>
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
            <Button type="primary">
              <Link to="/new-payment">Make Payment</Link>
            </Button>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={24}>
            <Collapse expandIconPosition="right">
              <Collapse.Panel
                header="Last transactions"
                extra={
                  <Button
                    type="link"
                    onClick={handleMoreClick}
                    style={{ lineHeight: 1, height: 'auto' }}
                  >
                    More
                  </Button>
                }
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

export default Account;
