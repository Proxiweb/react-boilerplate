import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'; // eslint-disable-line
import Notifications from 'react-notification-system-redux';
import { connect } from 'react-redux';

class ReduxNotifications extends Component { // eslint-disable-line
  static propTypes = {
    notifications: PropTypes.array,
  }

  render() {
    const { notifications } = this.props;
    return (
      <Notifications notifications={notifications} />
    );
  }
}

export default connect(
  state => ({ notifications: state.notifications })
)(ReduxNotifications);
