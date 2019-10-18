import React from 'react';
import { connect, useSelector } from 'react-redux';
import {
  Card as UiCard,
  List,
  Typography,
  Collapse,
  Button,
  Row,
  Col,
  Icon,
  Descriptions,
} from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IntlMessages from 'util/IntlMessages';
import { ReactComponent as MastercardSymbol } from '../../assets/icons/mc_symbol.svg';

const { Text } = Typography;

const getCardTypeName = typeId => {
  const types = useSelector(state => state.screens.main.card_types);
  const type = types.find(type => type.id === typeId);
  return type.name;
};

const borderedStyle = { border: '1px solid #E0E0E0', padding: '0.5em' };
const marginRight = { marginRight: '1em' };

const CardShortInfo = ({ number, typeName }) => {
  const lastFourDigits = number
    .split(' ')
    .map((part, partIndex) => (partIndex === 3 ? part : '****'))
    .join(' ');
  const MastercardIcon = props => (
    <Icon component={MastercardSymbol} {...props} />
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={marginRight}>{lastFourDigits}</span>
      <span style={{ ...marginRight, ...borderedStyle }}>{typeName}</span>
      <MastercardIcon style={{ fontSize: '2.5em' }} />
    </div>
  );
};

const Card = ({ card }) => {
  const { Panel } = Collapse;
  const { id, cvv, setpin, expiry, number, type_id } = card;
  const typeName = getCardTypeName(type_id);
  const expirationDate = `${expiry.month}/${expiry.year}`;
  const Header = <CardShortInfo number={number} typeName={typeName} />;
  const expandIcon = ({ isActive }) => {
    return (
      <div>
        <Text
          style={{ color: '#E0E0E0', marginRight: '1em', ...borderedStyle }}
        >
          Details
        </Text>
        <Icon
          type='right-circle'
          rotate={isActive ? 90 : 0}
          style={{ fontSize: '1em' }}
        />
      </div>
    );
  };
  return (
    <Collapse expandIconPosition='right' expandIcon={expandIcon}>
      <Panel header={Header} key='1'>
        <Descriptions title='Card info' bordered>
          <Descriptions.Item label='Number'>{number}</Descriptions.Item>
          <Descriptions.Item label='Expiration date'>
            {expirationDate}
          </Descriptions.Item>
          <Descriptions.Item label='CVV'>{cvv}</Descriptions.Item>
        </Descriptions>
      </Panel>
    </Collapse>
  );
};

const Cards = ({ cards }) => {
  return <List dataSource={cards} renderItem={item => <Card card={item} />} />;
};

const Account = ({ account }) => {
  const infoStyle = {
    // marginRight: '1em',
    textAlign: 'left',
  };
  const { number, amount, currency_info, cards, id } = account;
  return (
    <List.Item key={id}>
      <UiCard title='Account info'>
        <Row style={{ marginBottom: '1em' }}>
          {/* Name */}
          <Col span={8} style={infoStyle}>
            <span>Number: {number}</span>
          </Col>
          <Col span={8} style={infoStyle}>
            <span>Balance: S$ {amount}</span>
          </Col>
          <Col span={8} style={infoStyle}>
            <span>Currency: {currency_info.code}</span>
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

        <Row>
          <Col span={24} xl={12}>
            <List
              itemLayout='vertical'
              size='large'
              dataSource={accounts}
              renderItem={item => <Account account={item} />}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  actions
)(Accounts);
