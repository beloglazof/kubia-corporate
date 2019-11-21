import { Col, List, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Account from '../../components/Account';
import CompanyInfoCard from '../../components/CompanyInfoCard';
import Transactions from '../../components/Transactions';

const Accounts = () => {
  const accounts = useSelector(state => state.accounts);
  return (
    <>
      <Row>
        <Col span={24} xl={12}>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={accounts}
            renderItem={item => <Account account={item} />}
          />
        </Col>
        <Col span={24} xl={12}>
          <CompanyInfoCard />
        </Col>
      </Row>
      <Row>
        <Col xl={12}>
          <Transactions />
        </Col>
      </Row>
    </>
  );
};

export default Accounts;
