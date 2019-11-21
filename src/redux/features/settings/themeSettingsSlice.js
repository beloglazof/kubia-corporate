import { createSlice } from '@reduxjs/toolkit';
import {
  LAYOUT_TYPE_FULL,
  NAV_STYLE_DARK_HORIZONTAL,
  THEME_COLOR_SELECTION_PRESET,
  THEME_TYPE_DARK
} from '../../../constants/ThemeSetting';

const themeSettingsSlice = createSlice({
  name: 'screens',
  initialState: {
    navCollapsed: true,
    navStyle: NAV_STYLE_DARK_HORIZONTAL,
    layoutType: LAYOUT_TYPE_FULL,
    themeType: THEME_TYPE_DARK,
    colorSelection: THEME_COLOR_SELECTION_PRESET,

    pathname: '',
    width: window.innerWidth,
    isDirectionRTL: false,
    locale: {
      languageId: 'english',
      locale: 'en',
      name: 'English',
      icon: 'us'
    }
  },
  reducers: {
    toggleCollapsedNav(state, action) {
      state.navCollapsed = action.payload;
    },
    updateWindowWidth(state, action) {
      state.width = action.payload;
    },
    setThemeType(state, action) {
      state.themeType = action.payload;
    },
    setThemeColorSelection(state, action) {
      state.colorSelection = action.payload;
    },
    changeNavStyle(state, action) {
      state.navStyle = action.payload;
    },
    changeLayoutType(state, action) {
      state.layoutType = action.payload;
    },
    switchLanguage(state, action) {
      state.locale = action.payload;
    }
  }
});

export const {
  toggleCollapsedNav,
  updateWindowWidth,
  setThemeType,
  setThemeColorSelection,
  changeNavStyle,
  changeLayoutType,
  switchLanguage
} = themeSettingsSlice.actions;

export default themeSettingsSlice.reducer;
