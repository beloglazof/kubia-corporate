import React from 'react';
import { ReactComponent as Logo } from '../assets/images/main-logo.svg';
import logo from '../assets/images/main-logo-black.png';

const styles = {
  width: '70%',
  height: '70px',
};
const MainLogo = () => {
  return <Logo style={styles} alt="Kubia" />
  // return <img src={logo} style={styles} alt="Kubia" />
};

export default MainLogo;
