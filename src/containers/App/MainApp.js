import { Layout } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
} from '../../constants/ThemeSetting';
import { fetchMainScreen } from '../../redux/features/screens/screensSlice';
import { fetchUser } from '../../redux/features/user/userSlice';
import Routes from '../../routes/index';
import { footerText } from '../../util/config';
import Sidebar from '../Sidebar/index';
import AboveHeader from '../Topbar/AboveHeader/index';
import BelowHeader from '../Topbar/BelowHeader/index';
import HorizontalDark from '../Topbar/HorizontalDark/index';
import HorizontalDefault from '../Topbar/HorizontalDefault/index';
import Topbar from '../Topbar/index';
import InsideHeader from '../Topbar/InsideHeader/index';
import NoHeaderNotification from '../Topbar/NoHeaderNotification/index';

import { intercomToken } from '../../util/config';
import { usersMe } from '../../api';

const { Content, Footer } = Layout;

export class MainApp extends Component {
  getContainerClass = navStyle => {
    switch (navStyle) {
      case NAV_STYLE_DARK_HORIZONTAL:
        return 'gx-container-wrap';
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return 'gx-container-wrap';
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return 'gx-container-wrap';
      case NAV_STYLE_BELOW_HEADER:
        return 'gx-container-wrap';
      case NAV_STYLE_ABOVE_HEADER:
        return 'gx-container-wrap';
      default:
        return '';
    }
  };
  getNavStyles = navStyle => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return <HorizontalDefault />;
      case NAV_STYLE_DARK_HORIZONTAL:
        return <HorizontalDark location={this.props.location} />;
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return <InsideHeader />;
      case NAV_STYLE_ABOVE_HEADER:
        return <AboveHeader />;
      case NAV_STYLE_BELOW_HEADER:
        return <BelowHeader />;
      case NAV_STYLE_FIXED:
        return <Topbar />;
      case NAV_STYLE_DRAWER:
        return <Topbar />;
      case NAV_STYLE_MINI_SIDEBAR:
        return <Topbar />;
      case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
        return <NoHeaderNotification />;
      case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
        return <NoHeaderNotification />;
      default:
        return null;
    }
  };

  getSidebar = (navStyle, width) => {
    return <Sidebar location={this.props.location} />;
  };

  async componentDidMount() {
    const { fetchMainScreen, fetchUser } = this.props;
    await fetchMainScreen();
    // await fetchUser();
    const user = await usersMe()
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
    const { match, width, navStyle } = this.props;

    return (
      <Layout className="gx-app-layout">
        {this.getSidebar(navStyle, width)}
        <Layout>
          {this.getNavStyles(navStyle)}
          <Content
            className={`gx-layout-content ${this.getContainerClass(navStyle)} `}
          >
            <Routes match={match} />
            <Footer>
              <div className="gx-layout-footer-content">{footerText}</div>
            </Footer>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ themeSettings, user }) => {
  const { width, navStyle } = themeSettings;
  return { width, navStyle, user };
};

const actions = {
  fetchMainScreen,
  fetchUser,
};
export default connect(mapStateToProps, actions)(MainApp);
