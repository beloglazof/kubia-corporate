import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { Button, Col, Form, Row } from 'antd';
import TopTitle from '../../components/TopTitle';

import styles from './index.module.css';

const PayPage = ({ history }) => {
  const buttonWrapperStyle = {
    display: 'flex',
    justifyContent: 'space-around',
  };

  const typeButtonStyle = {
    width: '200px',
    height: '100px',
  };

  let { url } = useRouteMatch();
  let location = useLocation();
  const fromAccountId = location.state?.fromAccountId;
  const showBackButton = Boolean(fromAccountId);

  return (
    <>
      <TopTitle title="Choose payment type" backButton={showBackButton} />

      <div className={styles.typeButtonsWrapper}>
        <Button
          type="primary"
          size="large"
          className={styles.typeButton}
          onClick={() => history.push(`${url}/internal`, { fromAccountId })}
        >
          Internal
        </Button>
        <Button
          type="primary"
          size="large"
          className={styles.typeButton}
          onClick={() => history.push(`${url}/remittance`, { fromAccountId })}
        >
          Remittance
        </Button>
      </div>
    </>
  );
};

export default Form.create()(PayPage);
