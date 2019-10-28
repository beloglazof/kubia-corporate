import React from 'react';
import { useSelector } from 'react-redux';
import { Card as UiCard, Button, List, Row, Col } from 'antd';
import {Link} from 'react-router-dom'

import Card from '../Card';
import styles from './account.module.css';

const Cards = ({ cards }) => {
  return <List dataSource={cards} renderItem={item => <Card card={item} />} />;
};

const Account = ({ account }) => {
  const user = useSelector(state => state.auth.authUser);
  const { first_name, last_name } = user;
  const name = `${first_name} ${last_name}`;

  const { number, amount, currency_info, cards, id } = account;
  return (
    <List.Item key={id}>
      <UiCard title='Account info'>
        <div className={styles.name}>{name}</div>
        <Row className={styles.infoRow}>
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
        <Row>
          <Col span={8}>
            <Button type='primary'><Link to='/new-payment'>Make Payment</Link></Button>
          </Col>
        </Row>
        <Cards cards={cards} />
      </UiCard>
    </List.Item>
  );
};

export default Account;
