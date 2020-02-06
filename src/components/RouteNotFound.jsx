import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useSelector } from 'react-redux';

const RouteNotFound = () => {
  let history = useHistory();
  const { firstPagePath } = useSelector(state => state.settings);

  return (
    <Route path="*">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            type="primary"
            onClick={() => history.push(firstPagePath)}
          >
            Back Home
          </Button>
        }
      />
    </Route>
  );
};

export default RouteNotFound;
