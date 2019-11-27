import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  changeNavStyle,
  toggleCollapsedNav
} from '../../redux/features/settings/themeSettingsSlice';
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from '../../constants/ThemeSetting';
import MainLogo from '../../components/MainLogo';

class SidebarLogo extends Component {
  render() {
    const { width, themeType, navCollapsed } = this.props;
    let { navStyle } = this.props;
    if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
      navStyle = NAV_STYLE_DRAWER;
    }
    return (
      <div className="gx-layout-sider-header">
        {navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR ? (
          <div className="gx-linebar">
            <i
              className={`gx-icon-btn icon icon-${
                navStyle === NAV_STYLE_MINI_SIDEBAR
                  ? 'menu-unfold'
                  : 'menu-fold'
              } ${themeType !== THEME_TYPE_LITE ? 'gx-text-white' : ''}`}
              onClick={() => {
                if (navStyle === NAV_STYLE_DRAWER) {
                  this.props.toggleCollapsedNav(!navCollapsed);
                } else if (navStyle === NAV_STYLE_FIXED) {
                  this.props.onNavStyleChange(NAV_STYLE_MINI_SIDEBAR);
                } else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
                  this.props.toggleCollapsedNav(!navCollapsed);
                } else {
                  this.props.onNavStyleChange(NAV_STYLE_FIXED);
                }
              }}
            />
          </div>
        ) : null}

        <Link to="/" className="gx-site-logo">
          {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR &&
          width >= TAB_SIZE ? (
            <MainLogo />
          ) : themeType === THEME_TYPE_LITE ? (
            <img alt="" src={require('assets/images/main-logo-black.png')} />
          ) : (
            <MainLogo />
          )}
        </Link>
      </div>
    );
  }
}

const mapStateToProps = ({ themeSettings }) => {
  const { navStyle, themeType, width, navCollapsed } = themeSettings;
  return { navStyle, themeType, width, navCollapsed };
};

export default connect(mapStateToProps, {
  changeNavStyle,
  toggleCollapsedNav
})(SidebarLogo);
