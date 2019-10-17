import { ConfigProvider } from 'antd';
import { setInitUrl } from 'appRedux/actions/Auth';
import {
  onLayoutTypeChange,
  onNavStyleChange,
  setThemeType,
} from 'appRedux/actions/Setting';
import AppLocale from 'lngProvider';
import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import URLSearchParams from 'url-search-params';
import { getUser } from '../../appRedux/actions/Auth';
import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK,
} from '../../constants/ThemeSetting';
import SignIn from '../SignIn';
import SignUp from '../SignUp';
import MainApp from './MainApp';

const RestrictedRoute = ({ component: Component, token, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      token ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/signin',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class App extends Component {
  setLayoutType = layoutType => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('full-layout');
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove('full-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('boxed-layout');
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('full-layout');
      document.body.classList.add('framed-layout');
    }
  };

  setNavStyle = navStyle => {
    if (
      navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
      navStyle === NAV_STYLE_DARK_HORIZONTAL ||
      navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
      navStyle === NAV_STYLE_ABOVE_HEADER ||
      navStyle === NAV_STYLE_BELOW_HEADER
    ) {
      document.body.classList.add('full-scroll');
      document.body.classList.add('horizontal-layout');
    } else {
      document.body.classList.remove('full-scroll');
      document.body.classList.remove('horizontal-layout');
    }
  };

  componentDidMount() {
    // if (this.props.initURL === '') {
    //   this.props.setInitUrl(this.props.history.location.pathname);
    // }
    const { history, token, initURL, location } = this.props;
    // getUser()
    if (location.pathname === '/') {
      if (token === null) {
        history.push('/signin');
        // return <Redirect to={'/signin'} />;
      } else if (initURL === '' || initURL === '/' || initURL === '/signin') {
        history.push('/sample');

        // return <Redirect to={'/sample'} />;
      } else {
        history.push(initURL);

        // return <Redirect to={initURL} />;
      }
    }
    const params = new URLSearchParams(this.props.location.search);
    if (params.has('theme')) {
      this.props.setThemeType(params.get('theme'));
    }
    if (params.has('nav-style')) {
      this.props.onNavStyleChange(params.get('nav-style'));
    }
    if (params.has('layout-type')) {
      this.props.onLayoutTypeChange(params.get('layout-type'));
    }
  }

  render() {
    const {
      match,
      themeType,
      layoutType,
      navStyle,
      locale,
      token,
    } = this.props;
    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add('dark-theme');
    }
    //
    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    const currentAppLocale = AppLocale[locale.locale];
    return (
      <ConfigProvider locale={currentAppLocale.antd}>
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <Switch>
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/signup' component={SignUp} />
            <RestrictedRoute
              path={`${match.url}`}
              token={token}
              component={MainApp}
            />
          </Switch>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  const { locale, navStyle, themeType, layoutType } = settings;
  const { authUser, token, initURL } = auth;
  return { locale, token, navStyle, themeType, layoutType, authUser, initURL };
};
export default connect(
  mapStateToProps,
  { setInitUrl, getUser, setThemeType, onNavStyleChange, onLayoutTypeChange }
)(App);
