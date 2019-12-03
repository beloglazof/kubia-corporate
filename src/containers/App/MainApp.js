import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import Sidebar from '../Sidebar/index';
import HorizontalDefault from '../Topbar/HorizontalDefault/index';
import HorizontalDark from '../Topbar/HorizontalDark/index';
import InsideHeader from '../Topbar/InsideHeader/index';
import AboveHeader from '../Topbar/AboveHeader/index';
import BelowHeader from '../Topbar/BelowHeader/index';

import Topbar from '../Topbar/index';
import { footerText } from '../../util/config';
import Routes from '../../routes/index';
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
  TAB_SIZE
} from '../../constants/ThemeSetting';
import NoHeaderNotification from '../Topbar/NoHeaderNotification/index';
import { fetchMainScreen } from '../../redux/features/screens/screensSlice';
import { fetchUser } from '../../redux/features/user/userSlice';

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

  componentDidMount() {
    const { fetchMainScreen, fetchUser } = this.props;
    fetchUser();
    fetchMainScreen();
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

const mapStateToProps = ({ themeSettings }) => {
  const { width, navStyle } = themeSettings;
  return { width, navStyle };
};

const actions = {
  fetchMainScreen,
  fetchUser
};
export default connect(mapStateToProps, actions)(MainApp);
