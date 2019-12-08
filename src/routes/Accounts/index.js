import { Col, List, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import Account from '../../components/Account';
import CompanyInfoCard from '../../components/CompanyInfoCard';

const Accounts = () => {
  const accounts = useSelector(state => state.accounts);
  const userType = useSelector(state => state.user?.type).toLowerCase();
  const isCorporateUser = userType === 'corporate';
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
        {isCorporateUser && (
          <Col span={24} xl={12}>
            <CompanyInfoCard />
          </Col>
        )}
      </Row>
      {/* <Row gutter={16}>
        <Col span={24} xl={12}>
          <LastTransactions history={history} />
        </Col>
      </Row> */}
    </>
  );
};

export default Accounts;
