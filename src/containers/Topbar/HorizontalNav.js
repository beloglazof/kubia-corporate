import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import IntlMessages from '../../util/IntlMessages';
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from '../../constants/ThemeSetting';
import { renderNavigationItems } from '../../routes';

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
    const { pathname, navStyle } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (
      <Menu
        defaultOpenKeys={[defaultOpenKeys]}
        selectedKeys={[selectedKeys]}
        mode="horizontal"
      >
        {renderNavigationItems()}
        {/*<SubMenu*/}
        {/*  className={this.getNavStyleSubMenuClass(navStyle)}*/}
        {/*  key="main"*/}
        {/*  title={<IntlMessages id="sidebar.main" />}*/}
        {/*>*/}
        {/*<Menu.Item key="home">*/}
        {/*  <Link to="/">*/}
        {/*    <Icon type="home" />*/}
        {/*    Home*/}
        {/*  </Link>*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="settings">*/}
        {/*  <Link to="/settings">*/}
        {/*    <Icon type="setting" />*/}
        {/*    Settings*/}
        {/*  </Link>*/}
        {/*</Menu.Item>*/}
        {/*</SubMenu>*/}
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
