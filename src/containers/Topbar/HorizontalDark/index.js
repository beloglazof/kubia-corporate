import { Layout, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink as Link } from 'react-router-dom';
import MainLogo from '../../../components/MainLogo';
import {
  switchLanguage,
  toggleCollapsedNav,
} from '../../../redux/features/settings/themeSettingsSlice';
import { signOut } from '../../../redux/features/session/sessionSlice';

const { Header } = Layout;

class HorizontalDark extends Component {
  render() {
    const { navCollapsed, location } = this.props;

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
                    this.props.toggleCollapsedNav(!navCollapsed);
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
                className="gx-header-horizontal-nav gx-d-none gx-d-lg-block"
                style={{ marginLeft: '2em' }}
              >
                <Navigation location={location} mode="horizontal" />
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Link to="/profile">
                  <Button
                    icon="user"
                    type="link"
                    style={{
                      color: '#e0e0e0',
                      marginBottom: '0',
                    }}
                  >
                    Profile
                  </Button>
                </Link>
                <Button
                  icon="logout"
                  type="link"
                  onClick={() => this.props.signOut()}
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
  }
}

const mapStateToProps = ({ themeSettings, user }) => {
  const { locale, navCollapsed } = themeSettings;
  return { locale, navCollapsed, user };
};
export default connect(mapStateToProps, {
  toggleCollapsedNav,
  switchLanguage,
  signOut,
})(HorizontalDark);
