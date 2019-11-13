import React from 'react';
import { useSelector } from 'react-redux';
import { Card as UiCard, Button, List, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import Card from '../Card';
import styles from './account.module.css';
import InactiveVirtualCard from '../InactiveCards/InactiveVirtualCard';
import InactivePhysicalCard from '../InactiveCards/InactivePhysicalCard';

const getInactiveCards = (cards = []) => {
  if (cards.length === 2) return [];
  if (cards.length === 0) return [{ typeId: 1 }, { typeId: 2 }];
  if (cards.length === 1) {
    const [{ type_id: activatedTypeId }] = cards;
    const inactiveTypeId = activatedTypeId === 1 ? 2 : 1;
    return [{ typeId: inactiveTypeId }];
  }
};

const renderInactiveCards = (inactiveCards) => {
  const renderInactiveCard = card => {
    const { typeId } = card;
    if (typeId === 1) return <InactiveVirtualCard />;
    if (typeId === 2) return <InactivePhysicalCard />;
    return null;
  };
  return <List dataSource={inactiveCards} renderItem={renderInactiveCard} />;
};

const renderCards = cards => {
  const renderCard = card => <Card card={card} />;

  return <List dataSource={cards} renderItem={renderCard} />;
};

const Account = ({ account }) => {
  const user = useSelector(({ user }) => user);
  const { first_name, last_name } = user;
  const name = first_name && last_name && `${first_name} ${last_name}`;

  const { number, amount, currency_info, cards, id } = account;
  const inactiveCards = getInactiveCards(cards);
  return (
    <List.Item key={id}>
      <UiCard title="Account info">
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
            <Button type="primary">
              <Link to="/new-payment">Make Payment</Link>
            </Button>
          </Col>
        </Row>
        {cards.length > 0 && renderCards(cards)}
        {inactiveCards.length > 0 && renderInactiveCards(inactiveCards)}
      </UiCard>
    </List.Item>
  );
};

export default Account;
