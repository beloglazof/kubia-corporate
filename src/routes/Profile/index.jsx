import React from 'react';
import TopTitle from '../../components/TopTitle';
import { useSelector } from 'react-redux';
import { Descriptions, List, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { startCase } from 'lodash';
import styles from './index.module.css';

const links = [
  { name: 'reports', path: '/reports', iconName: 'file' },
  { name: 'documents', path: '/documents', iconName: 'container' },
  { name: 'settings', path: '/settings', iconName: 'setting' },
];

const Profile = () => {
  const { first_name, last_name, phone_formatted, email } = useSelector(
    state => state.user
  );
  const fullName = `${first_name} ${last_name}`;
  const itemStyle = { fontWeight: 'bold' };

  return (
    <div>
      <TopTitle title="Profile" />
      <div
        className={styles.content}
        style={{ display: 'flex', flexWrap: 'wrap' }}
      >
        <Descriptions
          size="small"
          title={fullName}
          column={1}
          layout="vertical"
          className={styles.descriptions}
        >
          <Descriptions.Item label="Phone">
            <span style={itemStyle}>{phone_formatted}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <span style={itemStyle}>{email}</span>
          </Descriptions.Item>
        </Descriptions>

        <div>
          <h3 className={styles.linksTitle}>Links</h3>
          <div className={styles.links}>
            {links.map(link => {
              const name = startCase(link.name);
              return (
                <Link to={link.path} className={styles.link}>
                  <Button
                    type="primary"
                    icon={link.iconName}
                    className={styles.linkButton}
                  >
                    {name}
                    <Icon style={{ marginLeft: 'auto' }} type="right" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
