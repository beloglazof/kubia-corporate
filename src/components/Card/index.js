import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Button, Collapse, Row, Col } from 'antd';

import { ReactComponent as MastercardSymbol } from '../../assets/icons/mc_symbol.svg';
import CardImg from '../../assets/images/card2.png';

const marginRight = { marginRight: '1em' };
const marginLeft = { marginLeft: '0.4em' };
const numberStyle = {
  whiteSpace: 'nowrap',
  width: '120px',
  ...marginRight,
};
const markerStyle = {
  fontSize: '0.7em',
  letterSpacing: '0.05em',
  border: '1px solid #A0A0A0',
  padding: '0.09em 0.5em',
  opacity: '0.7',
  width: '65px',
  textAlign: 'center',
  ...marginRight,
};

const MastercardIcon = props => (
  <Icon component={MastercardSymbol} {...props} />
);

const CardShortInfo = ({ number, typeName }) => {
  const lastFourDigits = number
    .split(' ')
    .map((part, partIndex) => (partIndex === 3 ? part : '****'))
    .join(' ');

  const shortInfoStyle = { display: 'flex', alignItems: 'center' };
  const creditCardIconStyle = { fontSize: '1.7em', ...marginRight };
  const mastercardIconStyle = { fontSize: '2.5em', ...marginLeft };

  return (
    <div style={shortInfoStyle}>
      <Icon type='credit-card' style={creditCardIconStyle} />
      <span style={numberStyle}>{lastFourDigits}</span>
      <span style={markerStyle}>{typeName}</span>
      <MastercardIcon style={mastercardIconStyle} />
    </div>
  );
};

const expandIcon = ({ isActive }) => {
  const btnStyle = {
    marginBottom: '0',
    backgroundColor: '#38424b',
    padding: '0.3em 0.7em 0.2em 1em',
    height: '26px',
  };
  const iconStyle = { fontSize: '1em', marginTop: '0.1em' };

  return (
    <div>
      <Button size='small' style={btnStyle}>
        Card details
        <Icon type='right' rotate={isActive ? 90 : 0} style={iconStyle} />
      </Button>
    </div>
  );
};

const getCardTypeName = typeId => {
  const types = useSelector(state => state.screens.main.card_types);
  const type = types.find(type => type.id === typeId);
  return type.name;
};

const getExpirationDate = expiry => {
  const month = expiry.month ? expiry.month : '00';
  const year = expiry.year ? expiry.year : '00';
  return `${month}/${year}`;
};

const Card = ({ card }) => {
  const { Panel } = Collapse;
  const { id, cvv, setpin, expiry, number, type_id } = card;
  const typeName = getCardTypeName(type_id);
  const expirationDate = getExpirationDate(expiry);

  const Header = <CardShortInfo number={number} typeName={typeName} />;
  const itemStyle = { marginTop: '0.5em', marginBottom: '1em' };

  return (
    <Collapse expandIconPosition='right' expandIcon={expandIcon}>
      <Panel header={Header} key={id}>
        <Row>
          <Col span={6}>
            <div style={{ textAlign: 'right' }}>
              <img src={CardImg} alt='Card image' height='200' />
            </div>
          </Col>
          <Col span={7}>
            <div style={itemStyle}>
              Number:
              <div className='param-value'>
                {number.trim().length ? number : 'No info'}
              </div>
            </div>
            <div style={itemStyle}>
              Expiration date:
              <div className='param-value'>{expirationDate}</div>
            </div>
            <div style={itemStyle}>
              CVV:
              <div className='param-value'>
                {cvv.length ? cvv : 'No info'}
              </div>
            </div>
          </Col>
          <Col span={11}>
            <Button block>Change PIN</Button>
          </Col>
        </Row>
      </Panel>
    </Collapse>
  );
};

export default Card;
