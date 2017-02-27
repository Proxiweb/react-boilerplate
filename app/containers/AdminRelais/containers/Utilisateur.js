import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import IconButton from 'material-ui/IconButton';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import Toggle from 'material-ui/Toggle';
import capitalize from 'lodash/capitalize';

import { addDestinataire } from 'containers/AdminCommunication/actions';
import { saveUtilisateur } from 'containers/Commande/actions';
import Panel from 'components/Panel';
import styles from './styles.css';

class Utilisateur extends Component {
  // eslint-disable-line
  static propTypes = {
    utilisateur: PropTypes.object.isRequired,
    addDest: PropTypes.func.isRequired,
    saveUtilisateur: PropTypes.func.isRequired,
  };

  handleToggle = (event, isChecked) => {
    const { utilisateur } = this.props;
    this.props.saveUtilisateur({
      ...utilisateur,
      notifications: {
        ...utilisateur.notifications,
        [event.target.name]: isChecked,
      },
    });
  };

  render() {
    const { utilisateur, addDest } = this.props;
    if (!utilisateur) return null;
    const identite = `${capitalize(utilisateur.prenom)} ${utilisateur.nom.toUpperCase()}`;
    return (
      <Panel padding={0}>
        <div className="row">
          <div className="col-md-3">
            <div
              style={{
                lineHeight: '48px',
                textAlign: 'left',
                padding: '0 1em',
              }}
            >
              {identite}
            </div>
          </div>
          <div className={`col-md-3 ${styles.comToggle}`}>
            {utilisateur.email &&
              <Toggle
                label="email"
                toggled={utilisateur.notifications.email}
                onToggle={this.handleToggle}
                name="email"
              />}
          </div>
          <div className={`col-md-3 ${styles.comToggle}`}>
            {utilisateur.telPortable &&
              <Toggle
                label="sms"
                toggled={utilisateur.notifications.sms}
                onToggle={this.handleToggle}
                name="sms"
              />}
          </div>
          <div className="col-md-3">
            {utilisateur.email &&
              <IconButton
                tooltip="Envoyer un email"
                onClick={() => addDest({
                  id: utilisateur.id,
                  email: utilisateur.email,
                  identite,
                })}
              >
                <EmailIcon />
              </IconButton>}
            {utilisateur.telPortable &&
              <IconButton
                tooltip="Envoyer un sms"
                onClick={() => addDest({
                  id: utilisateur.id,
                  telPortable: utilisateur.telPortable,
                  identite,
                })}
              >
                <MessageIcon />
              </IconButton>}
          </div>
        </div>
      </Panel>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    addDest: addDestinataire,
    saveUtilisateur,
  },
  dispatch
);

export default connect(null, mapDispatchToProps)(Utilisateur);
