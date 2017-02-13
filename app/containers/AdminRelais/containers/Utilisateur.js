import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import capitalize from 'lodash/capitalize';

import { addDestinataire } from 'containers/AdminCommunication/actions';
import Panel from 'components/Panel';

class Utilisateur extends Component { // eslint-disable-line
  static propTypes = {
    utilisateur: PropTypes.object.isRequired,
    addDest: PropTypes.func.isRequired,
  }

  render() {
    const { utilisateur, addDest } = this.props;
    if (!utilisateur) return null;
    const identite = `${capitalize(utilisateur.prenom)} ${utilisateur.nom.toUpperCase()}`;
    return (
      <Panel padding={0}>
        <div className="row">
          <div className="col-md-9">
            <div style={{ lineHeight: '48px', textAlign: 'left', padding: '0 1em' }}>
              {identite}
            </div>
          </div>
          <div className="col-md-3">
            { utilisateur.email &&
              <IconButton
                tooltip="Envoyer un email"
                onClick={() => addDest({
                  id: utilisateur.id,
                  email: utilisateur.email,
                  identite,
                })}
              >
                <EmailIcon />
              </IconButton>
            }
            { utilisateur.telPortable &&
              <IconButton
                tooltip="Envoyer un sms"
                onClick={() => addDest({
                  id: utilisateur.id,
                  telPortable: utilisateur.telPortable,
                  identite,
                })}
              >
                <MessageIcon />
              </IconButton>
            }
          </div>
        </div>
      </Panel>
    );
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  addDest: addDestinataire,
}, dispatch);

export default connect(null, mapDispatchToProps)(Utilisateur);
