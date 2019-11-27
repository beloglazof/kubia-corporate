import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import IntlMessages from 'util/IntlMessages';
import InfoView from '../templateComponents/InfoView';
import { signIn } from '../redux/features/session/sessionSlice';
import MainLogo from '../components/MainLogo';

const FormItem = Form.Item;

class SignIn extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.signIn(values);
      }
    });
  };

  componentDidMount() {
    console.log(this.props.token);
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
                {/*<p>*/}
                {/*  <IntlMessages id="app.userAuth.bySigning" />*/}
                {/*</p>*/}
                {/*<p>*/}
                {/*  <IntlMessages id="app.userAuth.getAccount" />*/}
                {/*</p>*/}
              </div>
              <div className="gx-app-logo">
                {/*<img alt="example" src={require('../assets/images/main-logo.svg')} />*/}
                <MainLogo />
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form
                onSubmit={this.handleSubmit}
                className="gx-signin-form gx-form-row0"
              >
                <FormItem>
                  {getFieldDecorator('phone', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        type: 'string',
                        message: 'Please input phone!'
                      }
                    ]
                  })(<Input placeholder="Phone" />)}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: 'Please input password!'
                      }
                    ]
                  })(<Input type="password" placeholder="Password" />)}
                </FormItem>
                {/*<FormItem>*/}
                {/*  {getFieldDecorator('remember', {*/}
                {/*    valuePropName: 'checked',*/}
                {/*    initialValue: true*/}
                {/*  })(*/}
                {/*    <Checkbox>*/}
                {/*      <IntlMessages id="appModule.iAccept" />*/}
                {/*    </Checkbox>*/}
                {/*  )}*/}
                {/*  <span className="gx-signup-form-forgot gx-link">*/}
                {/*    <IntlMessages id="appModule.termAndCondition" />*/}
                {/*  </span>*/}
                {/*</FormItem>*/}
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn" />
                  </Button>
                  {/*<span>*/}
                  {/*  <IntlMessages id="app.userAuth.or" />*/}
                  {/*</span>*/}
                  {/*<Link to="/signup">*/}
                  {/*  <IntlMessages id="app.userAuth.signUp" />*/}
                  {/*</Link>*/}
                </FormItem>
                <span className="gx-text-light gx-fs-sm">
                  {/* demo user email: 'demo@example.com' and password: 'demo#123' */}
                </span>
              </Form>
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

const actions = { signIn };

export default connect(mapStateToProps, actions)(WrappedNormalLoginForm);
