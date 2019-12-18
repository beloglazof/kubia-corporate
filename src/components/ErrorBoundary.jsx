import React from 'react';
import { Result, Button } from 'antd'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="Please contact us and we solve this problem"
          extra={[
            <Button
              type="primary"
              key="console"
              onClick={() => this.props.history.push('/')}
            >
              Go Home
            </Button>,
          ]}
        ></Result>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
