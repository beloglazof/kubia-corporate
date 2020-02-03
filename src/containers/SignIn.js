import React from 'react';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import IntlMessages from 'util/IntlMessages';
import MainLogo from '../components/MainLogo';
import { signIn, submitSignIn } from '../redux/features/session/sessionSlice';
import InfoView from '../templateComponents/InfoView';

const FormItem = Form.Item;

const CredentialsForm = ({ handleSubmit, getFieldDecorator }) => (
  <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">
    <FormItem>
      {getFieldDecorator('phone', {
        initialValue: '',
        rules: [
          {
            required: true,
            type: 'string',
            message: 'Please input phone!',
          },
        ],
      })(<Input placeholder="Phone" />)}
    </FormItem>
    <FormItem>
      {getFieldDecorator('password', {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Please input password!',
          },
        ],
      })(<Input type="password" placeholder="Password" />)}
    </FormItem>
    <FormItem>
      <Button type="primary" className="gx-mb-0" htmlType="submit">
        <IntlMessages id="app.userAuth.signIn" />
      </Button>
    </FormItem>
  </Form>
);

const CodeForm = ({ handleSubmit, getFieldDecorator }) => (
  <Form onSubmit={handleSubmit} className="gx-signin-form gx-form-row0">
    <FormItem>
      {getFieldDecorator('code', {
        initialValue: '',
        rules: [
          {
            required: true,
            message: 'Please input code from SMS!',
          },
        ],
      })(<Input type="number" placeholder="Code from SMS" />)}
    </FormItem>
    <FormItem>
      <Button type="primary" className="gx-mb-0" htmlType="submit">
        <IntlMessages id="app.userAuth.send" />
      </Button>
    </FormItem>
  </Form>
);

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authState: 'credentials',
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const response = await this.props.signIn(values);
        if (response && response === 'TWO_FACTOR_AUTH') {
          this.setState({ authState: 'code' });
        }
      }
    });
  };

  handleCodeSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        await this.props.submitSignIn(values.code);
      }
    });
  };

  componentDidMount() {
    if (this.props.token !== null) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate() {
    if (this.props.token !== null) {
      this.props.history.push('/');
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { authState } = this.state;
    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg" />
              <div className="gx-app-logo-wid">
                <h1>
                  <IntlMessages id="app.userAuth.signIn" />
                </h1>
              </div>
              <div className="gx-app-logo">
                <MainLogo />
              </div>
            </div>
            <div className="gx-app-login-content">
              {authState === 'credentials' && (
                <CredentialsForm
                  handleSubmit={this.handleSubmit}
                  getFieldDecorator={getFieldDecorator}
                />
              )}

              {authState === 'code' && (
                <CodeForm
                  handleSubmit={this.handleCodeSubmit}
                  getFieldDecorator={getFieldDecorator}
                />
              )}
            </div>
            <InfoView />
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignIn);

const mapStateToProps = ({ session }) => {
  const { token } = session;
  return { token };
};

const actions = { signIn, submitSignIn };

export default connect(mapStateToProps, actions)(WrappedNormalLoginForm);
