import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const TopTitle = ({ title, children = null, backButton = true }) => {
  let history = useHistory();

  return (
    <Row style={{ marginBottom: '1.5em' }}>
      <Col span={24}>
        <div style={{ display: 'flex', alignItems: 'bottom' }}>
          <Typography.Title level={2} style={{ marginBottom: '0.2em' }}>
            {title}
          </Typography.Title>
          <div style={{marginLeft: '1em'}}>{children}</div>
        </div>
        {backButton && (
          <Button
            icon="left"
            onClick={() => history.goBack()}
            style={{ padding: 0 }}
            type="link"
          >
            Go back
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default TopTitle;
