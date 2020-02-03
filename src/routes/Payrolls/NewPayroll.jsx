import React, { useState } from 'react';
import TopTitle from '../../components/TopTitle';
import { useSelector } from 'react-redux';
import {
  Select,
  Table,
  Input,
  Button,
  Popconfirm,
  Form as AntForm,
} from 'antd';
import { Form, Field } from 'react-final-form';
const { Option } = Select;

const NewPayroll = () => {
  const accounts = useSelector(state => state.accounts);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currency, setCurrency] = useState(accounts[0].currency_info.code);

  return (
    <div>
      <TopTitle title="New Payroll" />
      <div style={{ display: 'flex', marginBottom: '1em' }}>
        <label style={{ marginRight: '1em' }}>
          Select account
          <br />
          <Select defaultValue={accounts[0].id}>
            {accounts &&
              accounts.map(account => (
                <Option value={account.id} key={account.id}>
                  {account.number} | {account.currency_info.symbol}
                  {account.amount}
                </Option>
              ))}
          </Select>
        </label>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
          <Button type="primary">Start</Button>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginRight: '1em',
            }}
          >
            <span>Total amount</span>
            <span style={{ fontWeight: 'bold' }}>{totalAmount}</span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span>Currency</span>
            <span style={{ fontWeight: 'bold' }}>{currency}</span>
          </div>
        </div>
      </div>

      <div>
        <Form
          onSubmit={() => {}}
          render={({ handleSubmit }) => (
            <AntForm onSubmit={handleSubmit} layout="vertical">
              <Field name="Name">
                {props => (
                  <AntForm.Item label={props.input.name}>
                    <Input
                      name={props.input.name}
                      value={props.input.value}
                      onChange={props.input.onChange}
                    />
                  </AntForm.Item>
                )}
              </Field>
              <Button htmlType="submit">Submit</Button>
            </AntForm>
          )}
        />
        <div style={{ marginBottom: '1em', display: 'flex' }}>
          <Button type="primary">Import</Button>
        </div>
      </div>
      {/* <Table
        style={{ marginTop: '1em' }}
        dataSource={[
          {
            key: 0,
            name: 'Input name',
            phone: 'Input phone',
            amount: 'Input amount',
            actions: ['add'],
          },
        ]}
        bordered
      >
        <Table.Column title="Name" dataIndex="name" editable />
        <Table.Column title="Phone" dataIndex="phone" editable />
        <Table.Column title="Amount" dataIndex="amount" editable />
        <Table.Column title="Actions" />
      </Table> */}
      {/* <Form>
        <Form.Item label="Name">
          <Input />
        </Form.Item>
        <Form.Item label="Phone">
          <Input />
        </Form.Item>
        <Form.Item label="Amount">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button>Add</Button>
        </Form.Item>
      </Form> */}
    </div>
  );
};

NewPayroll.propTypes = {};

export default NewPayroll;
