import React from 'react';
import { useSelector } from 'react-redux';
import { Card as UiCard, Button, List, Row, Col } from 'antd';
import { Link } from 'react-router-dom';

import Card from '../Card';
import styles from './account.module.css';
import InactiveCard from '../InactiveCard';

const Cards = ({ cards }) => {
  const fillCards = cards => {
    switch (cards.length) {
      case 0:
        return [
          { typeId: 1, state: 'inactive' },
          { typeId: 2, state: 'inactive' }
        ];
      case 1:
        const existCardType = cards[0].type_id;
        const inactiveCardType = existCardType === 1 ? 2 : 1;
        return [...cards, { typeId: inactiveCardType, state: 'inactive' }];
      default:
        return cards;
    }
  };
  const filledCards = fillCards(cards);
  const renderCard = card => {
    if (card.state === 'inactive') {
      return <InactiveCard typeId={card.typeId} />;
    }
    return <Card card={card} />
  };
  return <List dataSource={filledCards} renderItem={renderCard} />;
};

const Account = ({ account }) => {
  const user = useSelector(state => state.auth.authUser);
  const { first_name, last_name } = user;
  const name = `${first_name} ${last_name}`;

  const { number, amount, currency_info, cards, id } = account;
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
        <Cards cards={cards} />
      </UiCard>
    </List.Item>
  );
};

export default Account;
