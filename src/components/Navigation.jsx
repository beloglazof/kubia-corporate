import { Menu, Icon } from 'antd';
import React from 'react';
import IntlMessages from '../util/IntlMessages';
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

export const NavigationItem = ({ path, iconName, name }) => {
  const activeStyles = {
    fontWeight: 'bold',
  };
  const showIcon = iconName && iconName.length > 0;

  return (
    <Menu.Item key={path}>
      gx-header-horizontal-nav gx-d-none gx-d-lg-block
      <NavLink activeStyle={activeStyles} to={path}>
        {showIcon && <Icon type={iconName} />}
        {<IntlMessages id={`route.${name}`} />}
      </NavLink>
    </Menu.Item>
  );
};

const renderNavigationItems = items => {
  return items.map(({ path, iconName, name }) => {
    const activeStyles = {
      fontWeight: 'bold',
    };
    const showIcon = iconName && iconName.length > 0;
    return (
      <Menu.Item key={path}>
        <NavLink activeStyle={activeStyles} to={path}>
          {showIcon && <Icon type={iconName} />}
          {<IntlMessages id={`route.${name}`} />}
        </NavLink>
      </Menu.Item>
    );
  });
};

const Navigation = ({ location, mode, theme }) => {
  const { pathname } = location;
  const selectedKeys = [pathname];

  return (
    <Menu selectedKeys={selectedKeys} mode={mode} theme={theme}>
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
    </Menu>
  );
};

export default Navigation;
