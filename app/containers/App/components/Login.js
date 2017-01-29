import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { ToolbarGroup } from 'material-ui/Toolbar';

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
      <ToolbarGroup>
        <FlatButton {...this.props} label="Connexion" href="/login" onClick={this.handleClick} />
      </ToolbarGroup>
    );
  }
}
