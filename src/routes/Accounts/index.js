import React from 'react';
import { connect, useSelector } from 'react-redux';
import { Card as UiCard, List, Typography, Collapse, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IntlMessages from 'util/IntlMessages';

const { Text } = Typography;

const getCardTypeName = typeId => {
  const types = useSelector(state => state.screens.main.card_types);
  const type = types.find(type => type.id === typeId);
  return type.name;
};

const CardShortInfo = ({ number, typeName }) => {
  const lastFourDigits = number
    .split(' ')
    .map((part, partIndex) => (partIndex === 3 ? part : '****'))
    .join(' ');
  return (
    <div>
      <div>{lastFourDigits}</div>
      <div>{typeName}</div>
      <FontAwesomeIcon icon={['fab', 'cc-mastercard']} size="4x" />
    </div>
  );
};

const Card = ({ card }) => {
  const { Panel } = Collapse;
  const { id, cvv, setpin, expiry, number, type_id } = card;
  const typeName = getCardTypeName(type_id);
  const Header = <CardShortInfo number={number} typeName={typeName} />;
  return (
    <Collapse expandIconPosition='right'>
      <Panel header={Header} key='1'>
        Card info
      </Panel>
    </Collapse>
  );
};

const Cards = ({ cards }) => {
  return <List dataSource={cards} renderItem={item => <Card card={item} />} />;
};

const Account = ({ account }) => {
  const infoStyle = {
    marginRight: '1em',
  };
  const { number, amount, currency_info, cards, id } = account;
  return (
    <List.Item key={id}>
      <UiCard title="Account info">
        <div>
          {/* Name */}
          <span style={infoStyle}>Number: {number}</span>
          <span style={infoStyle}>Balance: {amount}</span>
          <span>Currency: {currency_info.code}</span>
        </div>
        <div>
          <Button type='primary'>Make Payment</Button>
        </div>
        <Cards cards={cards} />
      </UiCard>
    </List.Item>
  );
};

const mapStateToProps = ({ accounts }) => {
  return { accounts };
};

const actions = {};
class Accounts extends React.Component {
  render() {
    const { accounts } = this.props;
    return (
      <div>
        <h2 className='title gx-mb-4'>
          <IntlMessages id='sidebar.accounts' />
        </h2>

        <div className='gx-d-flex justify-content-center'>
          <List
            itemLayout='vertical'
            size='large'
            dataSource={accounts}
            renderItem={item => <Account account={item} />}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(Accounts);
