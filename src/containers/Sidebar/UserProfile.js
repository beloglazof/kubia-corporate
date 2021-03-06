import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Avatar, Popover } from 'antd';
import { signOut } from '../../redux/features/session/sessionSlice';

class UserProfile extends Component {
  render() {
    const { authUser } = this.props;
    const userMenuOptions = (
      <ul className="gx-user-popover">
        {/* <li>My Account</li> */}
        {/* <li>Connections</li> */}
        <li onClick={() => this.props.signOut()}>Sign Out</li>
      </ul>
    );
    const username = authUser
      ? `${authUser.first_name} ${authUser.last_name}`
      : 'Dear Mr. User';

    return (
      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row">
        <Popover
          placement="bottomRight"
          content={userMenuOptions}
          trigger="click"
        >
          <Avatar
            src="https://via.placeholder.com/150x150"
            className="gx-size-40 gx-pointer gx-mr-3"
            alt=""
          />
          <span className="gx-avatar-name">
            {username}
            <i className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />
          </span>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  const { authUser } = auth;
  return { authUser };
};

const actions = {
  signOut
};

export default connect(
  mapStateToProps,
  actions
)(UserProfile);
