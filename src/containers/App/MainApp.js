import { Layout } from 'antd';
import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchMainScreen } from '../../redux/features/screens/screensSlice';
import { fetchUser } from '../../redux/features/user/userSlice';
import { footerText } from '../../util/config';
import Sidebar from '../Sidebar/index';

import { intercomToken } from '../../util/config';
import { usersMe } from '../../api';
import BoundaryRoute from '../../components/BoundaryRoute';
import RouteNotFound from '../../components/RouteNotFound';
import AppHeader from '../../components/AppHeader';
import routes from '../../routes';

const { Content, Footer } = Layout;

export class MainApp extends Component {
  async componentDidMount() {
    const { fetchMainScreen } = this.props;
    await fetchMainScreen();
    // await fetchUser();
    const user = await usersMe();
    if (user && window.Intercom) {
      const { email, id, name } = user;
      window.Intercom('boot', {
        app_id: intercomToken,
        created_at: Date.now(),
        user_id: id,
        email,
        name,
      });
    }
  }

  componentWillUnmount() {
    if (window.Intercom) {
      window.Intercom('shutdown');
    }
  }

  render() {
    const { navStyle, location, firstPagePath } = this.props;

    return (
      <Layout className="gx-app-layout">
        <Sidebar location={location} />
        <Layout>
          <AppHeader />
          <Content className={`gx-layout-content gx-container-wrap`}>
            <div className="gx-main-content-wrapper">
              <Switch>
                <Redirect exact from="/" to={firstPagePath} />
                {routes.map(route => (
                  <BoundaryRoute
                    exact={route.exact}
                    path={route.path}
                    component={route.component}
                  />
                ))}
                <RouteNotFound />
              </Switch>
            </div>
            <Footer style={{ marginTop: '1em' }}>
              <div className="gx-layout-footer-content">{footerText}</div>
            </Footer>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ themeSettings, user, settings }) => {
  const { width, navStyle } = themeSettings;
  const { firstPagePath } = settings;
  return { width, navStyle, user, firstPagePath };
};

const actions = {
  fetchMainScreen,
  fetchUser,
};
export default connect(mapStateToProps, actions)(MainApp);
