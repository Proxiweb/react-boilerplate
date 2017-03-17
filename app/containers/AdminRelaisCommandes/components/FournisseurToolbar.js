import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import MailIcon from 'material-ui/svg-icons/communication/mail-outline';
import MessageIcon from 'material-ui/svg-icons/communication/message';
import styles from './styles.css';

const FournisseurToolbar = ({ pushState, relaiId, commandeId, distribuee, validate, contacterAcheteurs }) => (
  <div className={`col-md-12 ${styles.toolbar}`}>
    <FlatButton
      label="Passer une commande"
      icon={<PersonIcon />}
      onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs`)}
    />
    <FlatButton
      label="Mail aux acheteurs"
      icon={<MailIcon />}
      onClick={() => contacterAcheteurs('email')}
    />
    <FlatButton
      label="SMS aux acheteurs"
      icon={<MessageIcon />}
      onClick={() => contacterAcheteurs('sms')}
    />
    {distribuee && <RaisedButton primary label="Finaliser la commande" onClick={validate} />}
  </div>
);

FournisseurToolbar.propTypes = {
  relaiId: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  contacterAcheteurs: PropTypes.func.isRequired,
  distribuee: PropTypes.bool.isRequired,
};

export default FournisseurToolbar;
