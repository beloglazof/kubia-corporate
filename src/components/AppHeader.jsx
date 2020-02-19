import { Layout, Button, Menu, Icon } from 'antd';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink as Link, useLocation, NavLink } from 'react-router-dom';
import MainLogo from './MainLogo';
import { toggleCollapsedNav } from '../redux/features/settings/themeSettingsSlice';
import { signOut } from '../redux/features/session/sessionSlice';
import Navigation from './Navigation';
import IntlMessages from '../util/IntlMessages';

const { Header } = Layout;

const AppHeader = () => {
  const navCollapsed = useSelector(state => state.themeSettings.navCollapsed);
  const dispatch = useDispatch();
  const location = useLocation();
  const selectedKeys = [location.pathname];

  return (
    <div className="gx-header-horizontal gx-header-horizontal-dark">
      {/* <div className="gx-header-horizontal-top">
          <div className="gx-container">
            <div className="gx-header-horizontal-top-flex">
              <div className="gx-header-horizontal-top-left">
                <i className="icon icon-alert gx-mr-3" />
                <p className="gx-mb-0 gx-text-truncate">
                  <IntlMessages id="app.announced" />
                </p>
              </div>
            </div>
          </div>
        </div> */}

      <Header className="gx-header-horizontal-main">
        <div className="gx-container">
          <div className="gx-header-horizontal-main-flex">
            <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
              <i
                className="gx-icon-btn icon icon-menu"
                onClick={() => {
                  dispatch(toggleCollapsedNav(!navCollapsed));
                }}
              />
            </div>
            <Link
              to="/"
              className="gx-d-none gx-d-lg-block gx-pointer gx-mr-xs-5 gx-logo"
            >
              <MainLogo />
            </Link>

            <div
              className="gx-d-none gx-d-lg-block gx-header-horizontal-nav"
              style={{
                marginLeft: '2em',
                display: 'flex',
                alignItems: 'center',
                flexGrow: '1',
              }}
            >
              <Navigation location={location} mode="horizontal" />
            </div>
            <div
            className='gx-header-horizontal-nav'
              style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu selectedKeys={selectedKeys} mode="horizontal">
                <Menu.Item key="/profile">
                  <NavLink activeStyle={{ fontWeight: 'bold' }} to="/profile">
                    <Icon type="profile" />
                    <IntlMessages id={`route.profile`} />
                  </NavLink>
                </Menu.Item>
              </Menu>

              <Button
                icon="logout"
                type="link"
                onClick={() => dispatch(signOut())}
                style={{
                  color: '#e0e0e0',
                  marginBottom: '0',
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </Header>
    </div>
  );
};

export default AppHeader;
