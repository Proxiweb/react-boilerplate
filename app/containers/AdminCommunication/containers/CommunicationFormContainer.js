import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';

import CommunicationForm from 'components/CommunicationForm';
import { sendCommunication, removeDestinataire } from 'containers/AdminCommunication/actions';
import { selectCommunicationDomain } from 'containers/AdminCommunication/selectors';
import { selectAuthApiKey } from 'containers/CompteUtilisateur/selectors';
import styles from './styles.css';

class CommunicationFormContainer extends Component { // eslint-disable-line
  static propTypes = {
    communication: PropTypes.object.isRequired,
    apiKey: PropTypes.string.isRequired,
    sendMessage: PropTypes.func.isRequired,
    removeDest: PropTypes.func.isRequired,
  }

  handleSubmit = ({ message, objet, sms }) => {
    const communication = {
      siteExpediteur: 'proxiweb',
      messageCourt: sms,
      messageLong: message,
      objet,
      envoye: false,
      destinataires: this.props.communication.destinataires.map((d) => ({
        email: d.email,
        telPortable: d.telPortable,
        etat: 'attente',
        identite: d.identite,
      })),
    };
    this.props.sendMessage(this.props.apiKey, communication);
  }

  render() {
    if (!this.props.communication) return null;
    const { sms, objet, html } = this.props.communication.message;
    const destinataires = this.props.communication.destinataires;

    return (
      <div className="row">
        <div className={`col-md-6 ${styles.panel} ${styles.dest}`}>
          {destinataires.sort((a, b) => a.identite > b.identite).map((dest, idx) => (
            <div key={idx} className="row end-md">
              <div className="col-md-4">
                {dest.email && <Chip
                  style={{ margin: 4 }}
                  onRequestDelete={() => this.props.removeDest(dest.id, 'email')}
                >
                  <Avatar color="#444" icon={<EmailIcon />} />
                  {dest.identite}
                </Chip>}
              </div>
              <div className="col-md-4">
                {dest.telPortable && <Chip
                  style={{ margin: 4 }}
                  onRequestDelete={() => this.props.removeDest(dest.id, 'telPortable')}
                >
                  <Avatar color="#444" icon={<MessageIcon />} />
                  {dest.identite}
                </Chip>}
              </div>
            </div>
          ))}
        </div>
        <div className={`col-md-6 ${styles.panel}`}>
          <CommunicationForm
            onSubmit={this.handleSubmit}
            message={{ sms, objet, html }}
            nbreDest={destinataires.length}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  communication: selectCommunicationDomain(),
  apiKey: selectAuthApiKey(),
});

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (apiKey, message) => dispatch(sendCommunication(apiKey, message)),
  removeDest: (id, moyen) => dispatch(removeDestinataire(id, moyen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationFormContainer);