import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const TopTitle = ({ title, backButton = true }) => {
  let history = useHistory();

  return (
    <Row style={{ marginBottom: '2em' }}>
      <Col span={24}>
        <Typography.Title level={2} style={{ marginBottom: '0.2em' }}>
          {title}
        </Typography.Title>
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
