import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';

export default class Logged extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  static muiName = 'IconMenu';

  handleClick = (event, url) => {
    event.preventDefault();
    this.props.onClick(event, url);
  }

  render() {
    const { user } = this.props;
    return (
      <IconMenu
        {...this.props}
        iconButtonElement={
          <IconButton><ExpandMore /></IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {user && <MenuItem {...this.props} primaryText="Commandes" value={`/relais/${user.relaiId}/commandes`} />}
        <MenuItem {...this.props} primaryText="Votre Compte" value="/votre-compte" />
        <MenuItem {...this.props} primaryText="Sign out" />
      </IconMenu>
    );
  }
}
