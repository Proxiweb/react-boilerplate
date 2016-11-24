import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import {List, ListItem} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Badge from 'material-ui/Badge';

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
          <Badge
            badgeContent={4}
            secondary
          >
            <CommunicationChatBubble style={{ height: 15 }} />
          </Badge>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
      <List>
        <ListItem
          primaryText="Brendan Lim"
          rightIcon={<CommunicationChatBubble />}
        />
        <ListItem
          primaryText="Eric Hoffman"
          rightIcon={<CommunicationChatBubble />}
        />
        <ListItem
          primaryText="Grace Ng"
          rightIcon={<CommunicationChatBubble />}
        />
        <ListItem
          primaryText="Kerem Suer"
          rightIcon={<CommunicationChatBubble />}
        />
        <ListItem
          primaryText="Raquel Parrado"
          rightIcon={<CommunicationChatBubble />}
        />
      </List>
      </IconMenu>
    );
  }
}
