import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Descriptions,
  Divider,
  Form,
  Popconfirm,
  Radio,
  Select,
  Table,
} from 'antd';
import { startCase } from 'lodash/string';

import { getSessions, killSession } from '../../api';
import { THEME_TYPE_DARK, THEME_TYPE_LITE } from '../../constants/ThemeSetting';
import { setFirstPagePath } from '../../redux/features/settings/settingsSlice';
import { setThemeType } from '../../redux/features/settings/themeSettingsSlice';
import { formatISODate } from '../../util';
import routes from '../index';
import styles from './settings.module.css';
import useAsync from '../../hooks/useAsync';
import TopTitle from '../../components/TopTitle';

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
          <Descriptions.Item label={fieldName} key={fieldName}>
            {value}
          </Descriptions.Item>
        );
      }
      return null;
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

CurrentSession.propTypes = {
  session: PropTypes.object.isRequired,
};

const CloseAllSessionsButton = ({ handler }) => {
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await handler();
    setLoading(false);
  };
  return (
    <Popconfirm
      title="Are you sure close all session until current?"
      onConfirm={handleConfirm}
      okText="Yes"
      cancelText="No"
    >
      <Button type="danger" loading={loading}>
        Close All
      </Button>
    </Popconfirm>
  );
};

CloseAllSessionsButton.propTypes = {
  handler: PropTypes.func.isRequired,
};

const CloseSessionButton = ({ sessionId, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    await handleClose(sessionId);
    setLoading(false);
  };
  return (
    <Popconfirm
      title="Are you sure to close this session"
      onConfirm={handleClick}
      okText="Yes"
      cancelText="No"
    >
      <Button type="danger" style={{ marginBottom: 0 }} loading={loading}>
        Close
      </Button>
    </Popconfirm>
  );
};

CloseSessionButton.propTypes = {
  sessionId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const Settings = () => {
  const [sessions, setSessions] = useAsync(getSessions, []);
  const [currentSession, setCurrentSession] = useState({});
  useEffect(() => {
    const current = sessions.find(session => session.current);
    const otherSessions = sessions.filter(session => !session.current);
    if (current) {
      setCurrentSession(current);
    }
    setSessions(otherSessions);
  }, [sessions.length]);

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
    wrapperCol: { xs: 12, sm: 6 },
    layout: 'vertical',
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
      key: 'ip',
    },
    {
      title: 'User Agent',
      dataIndex: 'userAgent',
      key: 'userAgent',
      ellipsis: true,
    },
    {
      title: 'Creation Date',
      dataIndex: 'created',
      key: 'created',
      render: v => formatISODate(v),
    },
    {
      title: 'Expiration Date',
      dataIndex: 'expire',
      key: 'expire',
      render: v => formatISODate(v),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <CloseSessionButton sessionId={record.id} handleClose={closeSession} />
      ),
    },
  ];
  const showCloseAllButton = sessions && sessions.length > 0;
  const showSessionsTable = sessions && sessions.length > 0;

  const currentTheme = useSelector(state => state.themeSettings.themeType);
  const handleThemeChange = event => {
    const { value } = event.target;
    dispatch(setThemeType(value));
  };
  return (
    <>
      <TopTitle title="Settings" backButton />
      <section className={styles.parameter}>
        <Form {...formLayoutProps}>
          <Form.Item label="Select your first page">
            <Select
              placeholder={'Any route'}
              value={firstPagePath}
              onChange={handleFirstPageChange}
            >
              {routes.map(item => (
                <Select.Option value={item.path} key={item.path}>
                  {startCase(item.name)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Theme">
            <Radio.Group
              onChange={handleThemeChange}
              defaultValue={currentTheme}
            >
              <Radio.Button value={THEME_TYPE_DARK}>Dark</Radio.Button>
              <Radio.Button value={THEME_TYPE_LITE}>Light</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
      </section>
      <section className={styles.parameter}>
        <Divider orientation={'left'} style={{ fontSize: '1.4em' }}>
          Active sessions
        </Divider>
        <CurrentSession session={currentSession} />
        <div
          style={{
            display: 'flex',
            flexFlow: 'row-reverse',
            marginBottom: '1em',
          }}
        >
          {showCloseAllButton && (
            <CloseAllSessionsButton handler={handleCloseAllClick} />
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
            bordered
          />
        )}
      </section>
    </>
  );
};

export default Settings;
