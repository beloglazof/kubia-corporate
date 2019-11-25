import React, { useEffect, useState } from 'react';
import { Button, Descriptions, Divider, Form, Select, Table } from 'antd';

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
  const [currentSession, setCurrentSession] = useState(null);
  useEffect(() => {
    async function fetchSessions() {
      const fetchedSessions = await getSessions();
      if (fetchedSessions) {
        const current = fetchedSessions.find(session => session.current);
        const otherSessions = fetchedSessions.filter(
          session => !session.current
        );
        setCurrentSession(current);
        setSessions(otherSessions);
      }
    }

    fetchSessions();
  }, []);

  const closeSession = async sessionId => {
    const killed = await killSession(sessionId);
    if (killed) {
      setSessions(prevSessions =>
        prevSessions.filter(session => session.id !== sessionId)
      );
    }
  };

  const handleCloseAllClick = async () => {
    const sessionIds = sessions.map(({ id }) => id);
    const allKilled = await killSession(sessionIds);
    if (allKilled) {
      setSessions([]);
    }
  };

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
  const showCloseAllButton = sessions && sessions.length > 0;
  const showSessionsTable = sessions && sessions.length > 0;
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
        <CurrentSession session={currentSession} />
        <div>
          {showCloseAllButton && (
            <Button onClick={handleCloseAllClick} type="primary">
              Close All
            </Button>
          )}
        </div>
        {showSessionsTable && (
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
        )}
      </section>
    </>
  );
};

export default Settings;

const CurrentSession = ({ session }) => {
  if (!session) return null;
  const visibleFields = new Set(['created', 'expire', 'ip']);
  const dateFields = new Set(['created', 'expire']);
  const renderSession = fields => {
    return Object.entries(fields).map(([fieldName, fieldValue]) => {
      if (visibleFields.has(fieldName)) {
        const value = dateFields.has(fieldName)
          ? formatISODate(fieldValue)
          : fieldValue;
        return (
          <Descriptions.Item label={fieldName}> {value}</Descriptions.Item>
        );
      }
    });
  };
  return (
    <Descriptions
      title="Current session"
      column={1}
      size="small"
      style={{ marginBottom: '2em' }}
      bordered
    >
      {renderSession(session)}
    </Descriptions>
  );
};
