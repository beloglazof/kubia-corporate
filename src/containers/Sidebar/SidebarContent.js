import { Menu } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Auxiliary from 'util/Auxiliary';
import CustomScrollbars from 'util/CustomScrollbars';
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE,
} from '../../constants/ThemeSetting';
import { renderNavigationItems } from '../../routes';
import UserInfo from '../../templateComponents/UserInfo';
import AppsNavigation from './AppsNavigation';
import SidebarLogo from './SidebarLogo';
import Navigation from '../../components/Navigation';

class SidebarContent extends Component {
  getNoHeaderClass = navStyle => {
    if (
      navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR ||
      navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR
    ) {
      return 'gx-no-header-notifications';
    }
    return '';
  };
  getNavStyleSubMenuClass = navStyle => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return 'gx-no-header-submenu-popup';
    }
    return '';
  };

  render() {
    const { themeType, navStyle, location } = this.props;
    const selectedKeys = location.pathname;
    const theme = themeType === THEME_TYPE_LITE ? 'lite' : 'dark';
    return (
      <>
        <SidebarLogo />
        <div className="gx-sidebar-content">
          <div
            className={`gx-sidebar-notifications ${this.getNoHeaderClass(
              navStyle
            )}`}
          >
            {/* <UserInfo /> */}
            <AppsNavigation />
          </div>
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Navigation location={location} theme={theme} mode="inline" />
          </CustomScrollbars>
        </div>
      </>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ themeSettings }) => {
  const { navStyle, themeType, locale, pathname } = themeSettings;
  return { navStyle, themeType, locale, pathname };
};
export default connect(mapStateToProps)(SidebarContent);
