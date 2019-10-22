import React from 'react';
import { useSelector } from 'react-redux';
import { Card as UiCard, Button, List, Row, Col } from 'antd';

import Card from '../Card';

const Cards = ({ cards }) => {
  return <List dataSource={cards} renderItem={item => <Card card={item} />} />;
};

const Account = ({ account }) => {
  const infoStyle = {
    // marginRight: '1em',
    textAlign: 'left',
    display: 'flex'
  };
  const user = useSelector(state => state.auth.authUser);
  const { first_name, last_name } = user;
  const name = `${first_name} ${last_name}`;

  const { number, amount, currency_info, cards, id } = account;
  return (
    <List.Item key={id}>
      <UiCard title='Account info'>
        <div style={{ fontSize: '2em', marginBottom: '1em' }}>{name}</div>
        <Row style={{ marginBottom: '1em' }}>
          <Col span={8} style={infoStyle}>
            Number: <div className='param-value'>{number}</div>
          </Col>
          <Col span={8} style={infoStyle}>
            Balance: <div className='param-value'>S${amount}</div>
          </Col>
          <Col span={8} style={infoStyle}>
            Currency: <div className='param-value'>{currency_info.code}</div>
          </Col>
        </Row>
        <Row justify='center' align='middle'>
          <Col span={8}>
            <Button type='primary'>Make Payment</Button>
          </Col>
        </Row>
        <Cards cards={cards} />
      </UiCard>
    </List.Item>
  );
};

export default Account;
