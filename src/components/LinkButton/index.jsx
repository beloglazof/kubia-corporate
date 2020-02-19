import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { startCase } from 'lodash';

import styles from './index.module.css';
import { Button, Icon } from 'antd';

const LinkButton = ({ name, path, iconName, children }) => {
  const [buttonName, setButtonName] = useState()
  useEffect(() => {
    if (name) {
      const formattedName = startCase(name);
      setButtonName(formattedName)
    }
  }, [name])

  return (
    <Link to={path} className={styles.link}>
      <Button type="primary" icon={iconName} className={styles.linkButton}>
        {buttonName}
        {children}
        <Icon style={{ marginLeft: 'auto' }} type="right" />
      </Button>
    </Link>
  );
};

export default LinkButton;
