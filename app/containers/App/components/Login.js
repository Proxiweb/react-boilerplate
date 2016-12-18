import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class Login extends Component {
  static muiName = 'FlatButton';

  static propTypes = {
    onClick: PropTypes.func.isRequired,
  }

  handleClick = (event) => {
    event.preventDefault();
    this.props.onClick(event, '/login');
  }
  render() {
    return (
      <FlatButton {...this.props} label="Connexion" href="/login" onClick={this.handleClick} />
    );
  }
}
