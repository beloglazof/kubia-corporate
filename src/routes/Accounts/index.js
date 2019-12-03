import { Col, List, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Account from '../../components/Account';
import CompanyInfoCard from '../../components/CompanyInfoCard';
import Transactions from '../../components/Transactions';
import LastTransactions from '../../components/Transactions/LastTransactions';

const Accounts = ({ history }) => {
  const accounts = useSelector(state => state.accounts);
  return (
    <>
      <Row gutter={16}>
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
      <Row gutter={16}>
        <Col span={24} xl={12}>
          {/* <Transactions /> */}
          <LastTransactions history={history} />
        </Col>
      </Row>
    </>
  );
};

export default Accounts;
