import React from "react";
import PropTypes from "prop-types";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import PersonIcon from "material-ui/svg-icons/social/person";
import MailIcon from "material-ui/svg-icons/communication/mail-outline";
import MessageIcon from "material-ui/svg-icons/communication/message";
import styles from "./styles.css";

const FournisseurToolbar = ({
  pushState,
  relaiId,
  commandeId,
  distribuee,
  validate,
  contacterAcheteurs,
  finalisee
}) =>
  <div className={`col-md-12 ${styles.toolbar}`}>
    <FlatButton
      label="Passer une commande"
      icon={<PersonIcon />}
      onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs`)}
    />
    <FlatButton
      label="aux acheteurs"
      icon={<MailIcon />}
      title="Mail aux acheteurs"
      onClick={() => contacterAcheteurs("email")}
    />
    <FlatButton
      label="aux acheteurs"
      icon={<MessageIcon />}
      title="SMS aux acheteurs"
      onClick={() => contacterAcheteurs("sms")}
    />
    {distribuee && !finalisee && <RaisedButton primary label="Finaliser la commande" onClick={validate} />}
  </div>;

FournisseurToolbar.propTypes = {
  relaiId: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  pushState: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  contacterAcheteurs: PropTypes.func.isRequired,
  distribuee: PropTypes.bool.isRequired,
  finalisee: PropTypes.bool.isRequired
};

export default FournisseurToolbar;
