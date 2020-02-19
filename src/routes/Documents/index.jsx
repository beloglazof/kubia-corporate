import React from 'react';
import TopTitle from '../../components/TopTitle';
import { getDocuments } from '../../api';
import { Button } from 'antd';
import LinkButton from '../../components/LinkButton';

import styles from './index.module.css';

const statusIcon = {
  checked: 'check',
  ['in progress']: 'ellipsis',
  new: 'fire',
};

const Documents = () => {
  const documents = getDocuments();

  return (
    <div>
      <TopTitle title="Documents" backButton />
      <div className={styles.list}>
        {documents.map(({ name, id, status, templateId }) => {
          const path = {
            pathname: `/documents/${id}`,
            state: {
              templateId,
            },
          };
          return (
            <LinkButton
              iconName={statusIcon[status]}
              name={name}
              path={path}
              key={name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Documents;
