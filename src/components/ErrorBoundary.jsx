import React from 'react';
import { Result, Button } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorPagePath: null };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    // logErrorToMyService(error, errorInfo);
    this.setState({
      errorPagePath: this.props.history.location.pathname,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const moveFromErrorPage =
      this.state.errorPagePath &&
      this.state.errorPagePath !== this.props.history.location.pathname;
    if (moveFromErrorPage) {
      this.setState({
        hasError: false,
        errorPagePath: null,
      });
    }
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
