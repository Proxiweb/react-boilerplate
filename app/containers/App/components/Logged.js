import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import { ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import FlatButton from 'material-ui/FlatButton';

export default class Logged extends Component {
  static propTypes = {
    destinataires: PropTypes.array.isRequired,
    messages: PropTypes.array,
    pushState: PropTypes.func.isRequired,
  };

  static muiName = 'IconMenu';


  render() {
    const { destinataires, pushState, messages } = this.props;
    const elements = [];

    if (destinataires.length > 0) {
      elements.push(
        <FlatButton
          onClick={() => pushState('/communications/courante')}
          label={`Communication en cours (${destinataires.length})`}
          style={{ marginTop: 5 }}
        />
      );
    }

    if (messages && messages.length > 0) {
      elements.push(
        <IconMenu
          label="Nouveau message"
          iconButtonElement={
            <FlatButton
              label={
              `${messages.length} Message${messages.length > 1 ? 's' : ''} non lu${messages.length > 1 ? 's' : ''}`
              }
              icon={<CommunicationChatBubble />}
              style={{ marginTop: 5 }}
            />
          }
        >
          {messages.map((message, idx) =>
            <MenuItem
              key={idx}
              primaryText={message.objet}
              onClick={() =>
                pushState(`/messages/${message.id}`)
              }
            />
          )}
        </IconMenu>
      );
    }

    return <ToolbarGroup>{elements}</ToolbarGroup>;
  }
}
