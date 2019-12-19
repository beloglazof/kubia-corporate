import { Col, List, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Account from '../../components/Account';
import CompanyInfoCard from '../../components/CompanyInfoCard';
import useAsync from '../../hooks/useAsync';
import { getAccounts } from '../../api';
import { fetchAccounts } from '../../redux/features/accounts/accountsSlice';

const Accounts = () => {
  const accounts = useSelector(state => state.accounts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccounts());
  }, []);
  const userType = useSelector(state => state.user?.type);
  const isCorporateUser = userType && userType.toLowerCase() === 'corporate';
  return (
    <>
      <Row gutter={16}>
        <Col span={24} xl={12}>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={accounts}
            renderItem={item => <Account account={item} />}
            loading={!accounts}
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
