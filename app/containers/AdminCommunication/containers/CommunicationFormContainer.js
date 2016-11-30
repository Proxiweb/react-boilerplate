import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import CommunicationForm from 'components/CommunicationForm';
import { setMessage, removeDestinataire } from 'containers/AdminCommunication/actions';
import Avatar from 'material-ui/Avatar';
import EmailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import styles from './index.css';

class CommunicationFormContainer extends Component { // eslint-disable-line
  static propTypes = {
    communication: PropTypes.object.isRequired,
    setMessage: PropTypes.func.isRequired,
    removeDest: PropTypes.func.isRequired,
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
          <CommunicationForm onSubmit={this.props.setMessage} message={{ sms, objet, html }} nbreDest={destinataires.length} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  communication: state.admin.communication,
});

const mapDispatchToProps = (dispatch) => ({
  setMessage: (message) => dispatch(setMessage(message)),
  removeDest: (id, moyen) => dispatch(removeDestinataire(id, moyen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunicationFormContainer);
