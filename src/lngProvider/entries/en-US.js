import enUS from 'antd/es/locale/en_US';
import appLocaleData from 'react-intl/locale-data/en';
import enMessages from '../locales/en_US.json';

const EnLang = {
  messages: {
    ...enMessages
  },
  antd: enUS,
  locale: 'en-US',
  data: appLocaleData
};
export default EnLang;
