import React, { Component, PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';

export default class Logged extends Component {
  static propTypes = {
    destinataires: PropTypes.array.isRequired,
    messages: PropTypes.array,
    pushState: PropTypes.func.isRequired,
  };

  static muiName = 'IconMenu';


  render() {
    const { destinataires, pushState, messages } = this.props;
    return (
      <div className="row">
        {destinataires.length > 0 && <div className="col-md">
          <MenuItem onTouchTap={() => pushState('/communications/courante')} primaryText={`Communication en cours (${destinataires.length})`} />
        </div>}
        {messages && messages.length > 0 && <div className="col-md">
          <IconMenu
            label="Nouveau message"
            {...this.props}
            iconButtonElement={(
              <IconButton tooltip="Messages non lus" style={{ width: 15 }}>
                <CommunicationChatBubble />
              </IconButton>)}
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          >
            <List>
              {messages.map((message, idx) =>
                <ListItem
                  key={idx}
                  primaryText={message.objet}
                  rightIcon={<CommunicationChatBubble />}
                  onClick={() =>
                    pushState(`/messages/${message.id}`)
                  }
                />
              )}
            </List>
          </IconMenu>
        </div>}
      </div>
    );
  }
}
