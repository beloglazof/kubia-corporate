import React from 'react';
import { useSelector } from 'react-redux';
import { Icon, Button, Collapse, Row, Col, Spin } from 'antd';

import { ReactComponent as MastercardSymbol } from '../../assets/icons/mc_symbol.svg';
import CardImg from '../../assets/images/card2.png';
import styles from './card.module.css';
import { cardsNew } from '../../api';
import PhysicalCardActivationModal from '../PhysicalCardActivationModal';

const MastercardIcon = props => {
  const mastercardIconStyle = { fontSize: '2.5em', marginLeft: '0.4em' };
  return (
    <Icon component={MastercardSymbol} style={mastercardIconStyle} {...props} />
  );
};

const CardShortInfo = ({
  number,
  typeName,
  cardState,
  handleActivationTry
}) => {
  const lastFourDigits = number
    .split(' ')
    .filter(v => v)
    .map((part, partIndex) => (partIndex === 3 ? part : '****'))
    .join(' ');
  switch (cardState) {
    case 'CREATED':
      return (
        <div className={styles.shortInfo}>
          <span className={styles.typeName}>{typeName}</span>
          <Icon type="credit-card" className={styles.creditCardIcon} />
          <span className={styles.number}>{lastFourDigits}</span>
          <MastercardIcon className={styles.mastercardIcon} />
        </div>
      );
    case 'CREATE_FAILED':
      return (
        <div className={styles.shortInfo}>
          <span className={styles.typeName}>{typeName}</span>
          <Icon type="credit-card" className={styles.creditCardIcon} />
          Activation failed
          <Button
            onClick={handleActivationTry}
            size="small"
            className={`${styles.btn}`}
          >
            Try again
          </Button>
        </div>
      );
    case 'PREPARE':
      const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
      return (
        <div className={styles.shortInfo}>
          <span className={styles.typeName}>{typeName}</span>
          <Icon type="credit-card" className={styles.creditCardIcon} />
          <Spin indicator={antIcon} />
        </div>
      );
    default:
      return (
        <div className={styles.shortInfo}>
          <span className={styles.typeName}>{typeName}</span>
          <Icon type="credit-card" className={styles.creditCardIcon} />
        </div>
      );
  }
};

const ExpandIcon = ({ isActive }) => {
  return (
    <div>
      <Button size="small" className={`${styles.detailsButton} ${styles.btn}`}>
        Card details
        <Icon
          type="right"
          rotate={isActive ? 90 : 0}
          className={styles.rightIcon}
        />
      </Button>
    </div>
  );
};

export const getCardTypeName = typeId => {
  const types = useSelector(state => state?.screens?.main?.card_types);
  const type = types && types.find(type => type.id === typeId);
  if (!type) return '';
  return type.name;
};

const getExpirationDate = expiry => {
  const month = expiry.month ? expiry.month : '00';
  const year = expiry.year ? expiry.year : '00';
  return `${month}/${year}`;
};

const Card = ({ card }) => {
  const { Panel } = Collapse;
  const { id, cvv, setpin, expiry, number, type_id, cardstate } = card;

  const { name: cardState } = cardstate;
  const disabled = cardState === 'CREATE_FAILED';
  const showExpandIcon = !disabled;

  const typeName = getCardTypeName(type_id);
  const expirationDate = getExpirationDate(expiry);

  const Header = (
    <CardShortInfo number={number} typeName={typeName} cardState={cardState} />
  );
  const accountId = useSelector(state => state?.accounts[0]?.id);

  const activationTry = async () => {
    const params = {
      account_id: accountId,
      type_id,
      assoc_number: '',
      failed_id: 0,
      pin: ''
    };
    const res = await cardsNew();
  };

  return (
    <>
      <Collapse
        expandIconPosition="right"
        expandIcon={showExpandIcon ? ExpandIcon : () => {}}
      >
        <Panel header={Header} key={id} disabled={disabled}>
          <Row>
            <Col span={6} sm={8}>
              <div style={{ textAlign: 'right' }}>
                <img src={CardImg} alt="Card image" height="200" width="120" />
              </div>
            </Col>
            <Col span={7} sm={8}>
              <div className={styles.infoParam}>
                Number:
                <div className="param-value">
                  {number.trim().length ? number : 'No info'}
                </div>
              </div>
              <div className={styles.infoParam}>
                Expiration date:
                <div className="param-value">{expirationDate}</div>
              </div>
              <div className={styles.infoParam}>
                CVV:
                <div className="param-value">
                  {cvv.length ? cvv : 'No info'}
                </div>
              </div>
            </Col>
            <Col span={11} sm={8}>
              <Button block>Change PIN</Button>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      {cardState === 'CREATE_FAILED' && typeName === 'PHYSICAL' && (
        <PhysicalCardActivationModal />
      )}
    </>
  );
};

export default Card;
