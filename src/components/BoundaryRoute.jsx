import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const BoundaryRoute = props => {
  let history = useHistory();
  return (
    <ErrorBoundary history={history}>
      <Route {...props}>{props.children}</Route>
    </ErrorBoundary>
  );
};

export default BoundaryRoute;
