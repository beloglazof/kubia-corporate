import styles from './CardInfo.module.css';
import { Button, Icon } from 'antd';
import React from 'react';

const CardInfo = ({ typeName = '', handleActivateClick }) => {
  return (
    <div className={`${styles.wrapper}`}>
      <span className={styles.typeName}>{typeName.toUpperCase()}</span>
      <Icon type="credit-card" className={styles.creditCardIcon} />
      <Button
        className={styles.activateCardButton}
        onClick={handleActivateClick}
      >
        Activate your {typeName} card
      </Button>
    </div>
  );
};

export default CardInfo;
