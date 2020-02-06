import { Menu, Icon } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntlMessages from '../../util/IntlMessages';
import { NavLink } from 'react-router-dom';

const SubMenu = Menu.SubMenu;

const moneyCategoryItems = [
  {
    name: 'accounts',
    path: '/accounts',
    iconName: 'wallet',
  },
  {
    name: 'pay',
    path: '/payments/new',
    iconName: 'transaction',
  },
  {
    name: 'transactions',
    path: '/transactions',
    iconName: 'swap',
  },
];

const peopleCategoryItems = [
  {
    name: 'beneficiaries',
    path: '/beneficiaries',
    iconName: 'idcard',
    category: 'people',
  },
  {
    name: 'linkedPeople',
    path: '/linked-people',
    iconName: 'team',
    category: 'people',
  },
];

const renderNavigationItems = items => {
  const activeStyles = {
    fontWeight: 'bold',
  };
  const renderItem = route => {
    const showIcon = route.iconName && route.iconName.length > 0;

    return (
      <Menu.Item key={route.path}>
        <NavLink activeStyle={activeStyles} to={route.path}>
          {showIcon && <Icon type={route.iconName} />}
          {<IntlMessages id={`route.${route.name}`} />}
        </NavLink>
      </Menu.Item>
    );
  };

  return items.map(renderItem);
};

class HorizontalNav extends Component {
  render() {
    const { location } = this.props;
    const { pathname } = location;
    const selectedKeys = pathname;
    // const defaultOpenKeys = selectedKeys[1];
    return (
      <Menu selectedKeys={[selectedKeys]} mode="horizontal">
        <SubMenu
          key="money"
          title={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon type="dollar" style={{ fontSize: '1em' }} />
              <IntlMessages id={`navigation.category.money`} />
            </div>
          }
        >
          {renderNavigationItems(moneyCategoryItems)}
        </SubMenu>
        <SubMenu
          key="people"
          title={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Icon type="global" style={{ fontSize: '1em' }} />
              <IntlMessages id={`navigation.category.people`} />
            </div>
          }
        >
          {renderNavigationItems(peopleCategoryItems)}
        </SubMenu>
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
