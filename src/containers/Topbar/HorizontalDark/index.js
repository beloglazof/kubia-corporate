import { Layout, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink as Link, NavLink } from 'react-router-dom';
import UserInfo from 'templateComponents/UserInfo';
import CustomScrollbars from 'util/CustomScrollbars';
import MainLogo from '../../../components/MainLogo';
import {
  switchLanguage,
  toggleCollapsedNav,
} from '../../../redux/features/settings/themeSettingsSlice';
import HorizontalNav from '../HorizontalNav';
import languageData from '../languageData';
import { signOut } from '../../../redux/features/session/sessionSlice';
import IntlMessages from '../../../util/IntlMessages';

const { Header } = Layout;

// const Option = Select.Option;
// const menu = (
//   <Menu onClick={handleMenuClick}>
//     <Menu.Item key="1">Products</Menu.Item>
//     <Menu.Item key="2">Apps</Menu.Item>
//     <Menu.Item key="3">Blogs</Menu.Item>
//   </Menu>
// );

// function handleMenuClick(e) {
//   message.info('Click on menu item.');
// }

// function handleChange(value) {
//   console.log(`selected ${value}`);
// }

class HorizontalDark extends Component {
  state = {
    searchText: '',
  };

  languageMenu = () => (
    <CustomScrollbars className="gx-popover-lang-scroll">
      <ul className="gx-sub-popover">
        {languageData.map(language => (
          <li
            className="gx-media gx-pointer"
            key={JSON.stringify(language)}
            onClick={e => this.props.switchLanguage(language)}
          >
            <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
            <span className="gx-language-text">{language.name}</span>
          </li>
        ))}
      </ul>
    </CustomScrollbars>
  );

  updateSearchChatUser = evt => {
    this.setState({
      searchText: evt.target.value,
    });
  };

  render() {
    const { navCollapsed } = this.props;

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
                <HorizontalNav location={this.props.location} />
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Link to="/profile">
                  <Button
                    icon="user"
                    type="link"
                    onClick={() => this.props.signOut()}
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
        {/* <div className="gx-header-horizontal-nav gx-d-none gx-d-lg-block">
          <div className="gx-container">
            <div className="gx-header-horizontal-nav-flex">
              <HorizontalNav location={this.props.location} />
            </div>
          </div>
        </div> */}
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
