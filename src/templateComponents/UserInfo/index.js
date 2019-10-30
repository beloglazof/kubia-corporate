import React, { Component } from 'react';
import { connect, useSelector } from 'react-redux';
import { Avatar, Popover } from 'antd';
import { userSignOut } from 'appRedux/actions/Auth';
import { NavLink as Link } from 'react-router-dom';

const mapStateToProps = ({ auth }) => {
  const avatarUrl = auth?.authUser?.avatar['128'];
  return { avatarUrl };
};

class UserInfo extends Component {
  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        {/*<li>My Account</li>*/}
        <li>
          <Link style={{ color: 'inherit' }} to="/settings">
            Settings
          </Link>
        </li>
        <li onClick={() => this.props.userSignOut()}>Logout</li>
      </ul>
    );

    const { avatarUrl } = this.props;

    return (
      <Popover
        overlayClassName="gx-popover-horizantal"
        placement="bottomRight"
        content={userMenuOptions}
        trigger="click"
      >
        <Avatar src={avatarUrl} className="gx-avatar gx-pointer" alt="" />
      </Popover>
    );
  }
}

export default connect(
  mapStateToProps,
  { userSignOut }
)(UserInfo);
