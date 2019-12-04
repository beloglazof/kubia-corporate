import React, { Component } from 'react';
import { Avatar, Popover } from 'antd';
import { connect } from 'react-redux';
import { signOut } from '../../redux/features/session/sessionSlice';

const mapStateToProps = ({ user }) => {
  const avatarUrl = user.avatar?.length > 0 && user.avatar['128'];
  return { avatarUrl };
};

class UserInfo extends Component {
  render() {
    const userMenuOptions = (
      <ul className="gx-user-popover">
        {/*<li>My Account</li>*/}
        {/*<li>Connections</li>*/}
        <li onClick={() => this.props.signOut()}>Logout</li>
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

const actions = { signOut };
export default connect(mapStateToProps, actions)(UserInfo);
