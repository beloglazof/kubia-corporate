import { ConfigProvider } from 'antd';
import AppLocale from 'lngProvider';
import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import {
  changeLayoutType,
  changeNavStyle,
  setThemeType
} from '../../redux/features/settings/themeSettingsSlice';

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  THEME_TYPE_DARK
} from '../../constants/ThemeSetting';
import SignIn from '../SignIn';
// import SignUp from '../SignUp';
import MainApp from './MainApp';

const RestrictedRoute = ({ component: Component, ...rest }) => {
  const token = useSelector(({ session }) => session.token);
  return (
    <Route
      {...rest}
      render={props =>
        token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/sign-in',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

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

  // componentDidMount() {
  //   const { history, token, location } = this.props;
  //   if (location.pathname === '/') {
  //     if (token === null) {
  //       history.push('/sign-in');
  //     }
  //   }
  // }

  render() {
    const { match, themeType, layoutType, navStyle, locale } = this.props;
    if (themeType === THEME_TYPE_DARK) {
      document.body.classList.add('dark-theme');
    }

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
            <Route exact path="/sign-in" component={SignIn} />
            {/*<Route exact path="/sign-up" component={SignUp} />*/}
            <RestrictedRoute path={`${match.url}`} component={MainApp} />
          </Switch>
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

const mapStateToProps = ({ themeSettings, session }) => {
  const { locale, navStyle, themeType, layoutType } = themeSettings;
  const { token } = session;
  return { locale, token, navStyle, themeType, layoutType };
};
const actions = {
  setThemeType,
  changeNavStyle,
  changeLayoutType
};
export default connect(
  mapStateToProps,
  actions
)(App);
