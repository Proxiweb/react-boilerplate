import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PersonIcon from 'material-ui/svg-icons/social/person';
import includes from 'lodash/includes';
import styles from './styles.css';

const FournisseurToolbar = ({ pushState, roles, relaiId, commandeId, distribuee, validate }) => (
  <div className={`col-md-12 ${styles.toolbar}`}>
    <FlatButton
      label="Passer une commande"
      icon={<PersonIcon />}
      onClick={() => pushState(`/admin/relais/${relaiId}/commandes/${commandeId}/utilisateurs`)}
    />
    {distribuee && <RaisedButton primary label="Finaliser la commande" onClick={validate} />}
  </div>
);

FournisseurToolbar.propTypes = {
  relaiId: PropTypes.string.isRequired,
  commandeId: PropTypes.string.isRequired,
  roles: PropTypes.array.isRequired,
  pushState: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  distribuee: PropTypes.bool.isRequired,
};

export default FournisseurToolbar;
