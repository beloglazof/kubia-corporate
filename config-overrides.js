const path = require('path');
const {
  override,
  addLessLoader,
  useBabelRc,
  addWebpackPlugin,
} = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const overrideProcessEnv = value => config => {
  config.resolve.modules = [path.join(__dirname, 'src')].concat(
    config.resolve.modules
  );
  return config;
};

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#038fde',
    },
  }),
  overrideProcessEnv({
    VERSION: JSON.stringify(require('./package.json').version),
  }),
  useBabelRc(),
  addWebpackPlugin(new AntdDayjsWebpackPlugin())
);
