import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Typography, Result } from 'antd';
import { useSelector } from 'react-redux';
import useAsync from '../../hooks/useAsync';
import { getPeople, paymentsPay } from '../../api';
import { SGD } from '../../constants';
import {
  AccountSelect,
  LinkedUserSelect,
  AmountInput,
  NoteFieldInput,
} from '../../components/PaymentFields';
import { useHistory } from 'react-router-dom';
import getRandomString from '../../util/getRandomString';
import TopTitle from '../../components/TopTitle';

const formLayoutProps = {
  // labelCol: {
  //   xs: { span: 8 },
  //   sm: { span: 8 },
  //   md: { span: 6 },
  //   lg: { span: 4 },
  // },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 14 },
    xl: { span: 12 },
  },
  labelAlign: 'left',
  layout: 'vertical',
};

// const submitButtonLayoutProps = {
//   wrapperCol: {
//     xs: { offset: formLayoutProps.labelCol.xs.span },
//     sm: { offset: formLayoutProps.labelCol.sm.span },
//     md: { offset: formLayoutProps.labelCol.md.span },
//     lg: { offset: formLayoutProps.labelCol.lg.span },
//   },
// };

const InternalPaymentForm = ({ form, onSubmit }) => {
  const paymentType = 'internal';
  const accounts = useSelector(state => state.accounts);
  const [filteredAccounts, setFilteredAccounts] = useState(accounts);
  useEffect(() => {
    const filtered = accounts.filter(
      acc => acc.currency_info.code.toUpperCase() === SGD
    );
    setFilteredAccounts(filtered);
  }, []);
  const { getFieldValue, validateFields } = form;
  const accountId = getFieldValue('accountId');
  const account = accounts.find(a => a.id === accountId);
  const balance = account ? account.amount : 0;
  const [people] = useAsync(getPeople, []);
  const amountCurrency = SGD;
  const [loading, setLoading] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    validateFields(async (errors, values) => {
      setLoading(true);
      if (errors) {
        setLoading(false);
        return;
      }
      await onSubmit(values);
      setLoading(false);
    });
  };

  return (
    <Form {...formLayoutProps} onSubmit={handleSubmit} hideRequiredMark>
      <AccountSelect
        form={form}
        accounts={filteredAccounts}
        paymentType={paymentType}
      />
      <LinkedUserSelect form={form} people={people} />
      <AmountInput form={form} balance={balance} currency={amountCurrency} />
      <NoteFieldInput form={form} />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Send
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedForm = Form.create()(InternalPaymentForm);

const InternalPayment = () => {
  const [state, setState] = useState('input');
  const sendInternalPayment = async values => {
    const { buyAmount: amount, accountId, linkedUserId } = values;
    const idempotency = getRandomString();
    const result = await paymentsPay(
      amount,
      accountId,
      linkedUserId,
      idempotency
    );
    if (result) {
      setState('success');
    }
  };

  let history = useHistory();
  return (
    <Row>
      <Col span={24}>
        <TopTitle title="Internal payment" backButton />
        <div style={{ marginLeft: '1em' }}>
          {state === 'input' && <WrappedForm onSubmit={sendInternalPayment} />}
          {state === 'success' && (
            <Result
              status="success"
              title="Success!"
              extra={
                <Button
                  type="primary"
                  onClick={() => history.push('/payments/new')}
                >
                  Make new payment
                </Button>
              }
            />
          )}
        </div>
      </Col>
    </Row>
  );
};

export default InternalPayment;
