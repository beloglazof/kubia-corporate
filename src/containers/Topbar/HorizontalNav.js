import { Menu, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
} from '../../constants/ThemeSetting';
import { renderNavigationItems } from '../../routes';
import IntlMessages from '../../util/IntlMessages';
import { Link } from 'react-router-dom';

const SubMenu = Menu.SubMenu;

class HorizontalNav extends Component {
  getNavStyleSubMenuClass = navStyle => {
    switch (navStyle) {
      case NAV_STYLE_DEFAULT_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve';
      case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-inside-submenu-popup-curve';
      case NAV_STYLE_BELOW_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-below-submenu-popup-curve';
      case NAV_STYLE_ABOVE_HEADER:
        return 'gx-menu-horizontal gx-submenu-popup-curve gx-above-submenu-popup-curve';
      default:
        return 'gx-menu-horizontal';
    }
  };

  render() {
    const { location, navStyle } = this.props;
    const { pathname } = location;
    const selectedKeys = pathname;
    // const defaultOpenKeys = selectedKeys[1];
    return (
      <Menu
        // defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
      >
        {renderNavigationItems()}
      </Menu>
    );
  }
}

HorizontalNav.propTypes = {};
const mapStateToProps = ({ themeSettings }) => {
  const { themeType, navStyle, pathname, locale } = themeSettings;
  return { themeType, navStyle, pathname, locale };
};
export default connect(mapStateToProps)(HorizontalNav);
