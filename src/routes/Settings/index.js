import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Select, Table } from 'antd';

import { getSessions, killSession } from '../../api';
import styles from './settings.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setFirstPagePath } from '../../redux/features/settings/settingsSlice';
import { navItems } from '../index';
import { startCase } from 'lodash/string';
import { formatISODate } from '../../util';

const CloseSessionButton = ({ sessionId, handleClose }) => {
  const handleClick = () => {
    handleClose(sessionId);
  };
  return (
    <span>
      <Button type="primary" style={{ marginBottom: 0 }} onClick={handleClick}>
        Close
      </Button>
    </span>
  );
};

const Settings = ({}) => {
  const [sessions, setSessions] = useState([]);
  const closeSession = async sessionId => {
    const killed = await killSession(sessionId);
    if (killed) {
      setSessions(prevSessions =>
        prevSessions.filter(session => session.id !== sessionId)
      );
    }
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
      render: v => formatISODate(v)
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expire',
      key: 'expire',
      render: v => formatISODate(v)
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <CloseSessionButton sessionId={record.id} handleClose={closeSession} />
      )
    }
  ];

  useEffect(() => {
    async function fetchSessions() {
      const fetchedSessions = await getSessions();
      if (fetchedSessions) {
        setSessions(fetchedSessions.reverse());
      }
    }

    fetchSessions();
  }, []);

  const formLayoutProps = {
    labelAlign: 'left',
    labelCol: { xs: 12, sm: 6 },
    wrapperCol: { xs: 12, sm: 6 }
  };
  const { firstPagePath } = useSelector(state => state.settings);
  const dispatch = useDispatch();
  const handleFirstPageChange = value => {
    dispatch(setFirstPagePath(value));
  };
  return (
    <>
      <section className={styles.parameter}>
        <Divider
          orientation={'left'}
          style={{ fontSize: '1.4em', margin: '1.3em 0' }}
        >
          Settings
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
        <Divider orientation={'left'} style={{ fontSize: '1.4em' }}>
          Active sessions
        </Divider>
        <Table
          columns={columns}
          dataSource={sessions}
          size="small"
          loading={!sessions}
          pagination={{ pageSize: 5 }}
          rowKey={'id'}
          rowClassName={record => {
            if (record.current) return styles.current;
          }}
          bordered
        />
      </section>
    </>
  );
};

export default Settings;
