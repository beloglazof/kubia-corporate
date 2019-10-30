import React, { useEffect, useState } from 'react';
import { Form, Select, Table } from 'antd';
import { getSessions } from '../../api';

const columns = [
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip'
  },
  {
    title: 'User Agent',
    dataIndex: 'userAgent',
    key: 'userAgent'
  },
  {
    title: 'Creation Date',
    dataIndex: 'created',
    key: 'created'
  },
  {
    title: 'Expiration Date',
    dataIndex: 'expire',
    key: 'expire'
  }
];

const Settings = ({}) => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    async function fetchSessions() {
      const fetchedSessions = await getSessions();
      setSessions(fetchedSessions);
      console.log(fetchedSessions);
    }
    fetchSessions();
  }, [setSessions]);
  return (
    <div>
      <h1>Settings</h1>
      <Table columns={columns} dataSource={sessions} />
      {/*<Form.Item label="Select your first page">*/}
      {/*  <Select>*/}
      {/*    <Select.Option value="accounts">Accounts</Select.Option>*/}
      {/*  </Select>*/}
      {/*</Form.Item>*/}
    </div>
  );
};

export default Settings;
