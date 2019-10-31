import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Select, Table } from 'antd';
import { uniqueId } from 'lodash';
import { format, parseISO } from 'date-fns';

import { getSessions } from '../../api';
import { singaporeDateTimeFormat } from '../../util/config';
import styles from './settings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFirstPagePath } from '../../appRedux/features/settings/settingsSlice';
import { navItems } from '../index';
import { startCase } from 'lodash/string';

const formatDate = date => {
  if (!date) return;
  const parsedDate = parseISO(date);
  if (parsedDate) return format(parsedDate, singaporeDateTimeFormat.medium);
};

const columns = [
  {
    title: 'IP',
    dataIndex: 'ip',
    key: 'ip'
  },
  {
    title: 'User Agent',
    dataIndex: 'userAgent',
    key: 'userAgent',
    ellipsis: true
  },
  {
    title: 'Creation Date',
    dataIndex: 'created',
    key: 'created',
    render: formatDate
  },
  {
    title: 'Expiration Date',
    dataIndex: 'expire',
    key: 'expire',
    render: formatDate
  },
  {
    title: 'Action',
    key: 'action',
    render: () => (
      <span>
        <Button type="primary" style={{ marginBottom: 0 }}>
          Close
        </Button>
      </span>
    )
  }
];

const Settings = ({}) => {
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    async function fetchSessions() {
      const fetchedSessions = await getSessions();
      const keyedSessions = fetchedSessions.map(session => ({
        ...session,
        key: uniqueId()
      }));
      setSessions(keyedSessions);
      // console.log(fetchedSessions);
    }
    fetchSessions();
  }, []);

  const formLayoutProps = {
    wrapperCol: { xs: 12, sm: 6 },
    labelCol: { xs: 12, sm: 6 }
  };
  const { firstPagePath } = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const handleFirstPageChange = value => {
    dispatch(setFirstPagePath(value));
  };
  return (
    <>
      <h1>Settings</h1>
      <section className={styles.parameter}>
        {/*<h2>First page</h2>*/}
        <Divider orientation={'left'} style={{ fontSize: '1.4em' }}>
          First page
        </Divider>
        <Form {...formLayoutProps}>
          <Form.Item label="Select your first page">
            <Select
              placeholder={'Any route'}
              value={firstPagePath}
              onChange={handleFirstPageChange}
            >
              {navItems.map(item => (
                <Select.Option value={item.path}>
                  {startCase(item.name)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </section>
      <section className={styles.parameter}>
        {/*<h2>Active sessions</h2>*/}
        <Divider orientation={'left'} style={{ fontSize: '1.4em' }}>
          Active sessions
        </Divider>
        <Table
          columns={columns}
          dataSource={sessions}
          size="small"
          loading={!sessions}
          pagination={{ pageSize: 5 }}
          bordered
        />
      </section>
    </>
  );
};

export default Settings;
